import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { env } from "@/lib/env";
import { connectToDatabase } from "@/lib/db";
import { connectMongoClient, mongoClient } from "@/lib/mongodb";
import { Rating } from "@/models/rating";
import { Table } from "@/models/table";

type RatingRequest = {
    restaurantId?: string;
    tableId?: string;
    overallRating?: number;
    foodRating?: number;
    staffRating?: number;
    comment?: string;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_COLLECTION = "ratingRateLimits";

type RateLimitDocument = {
    _id: string;
    count: number;
    expiresAt: Date;
};

let rateLimitIndexPromise: Promise<string> | null = null;

function getClientKey(request: Request, tableId: string): string {
    if (!env.trustProxy) {
        return `anonymous:${tableId}`;
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = realIp ?? forwardedFor?.split(",")[0]?.trim();

    return `${clientIp || "unknown"}:${tableId}`;
}

async function isRateLimited(request: Request, tableId: string): Promise<boolean> {
    const now = Date.now();
    const window = Math.floor(now / RATE_LIMIT_WINDOW_MS);
    const key = `${getClientKey(request, tableId)}:${window}`;
    const expiresAt = new Date((window + 1) * RATE_LIMIT_WINDOW_MS);
    const collection = mongoClient
        .db(env.mongodbDbName)
        .collection<RateLimitDocument>(RATE_LIMIT_COLLECTION);

    rateLimitIndexPromise ??= connectMongoClient().then(() =>
        collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    );
    await rateLimitIndexPromise;

    const result = await collection.findOneAndUpdate(
        { _id: key },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
        { upsert: true, returnDocument: "after" },
    );

    return (result?.count ?? 0) > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: Request) {
    let body: RatingRequest;

    try {
        body = (await request.json()) as RatingRequest;
    } catch {
        return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
    }

    const { restaurantId, tableId, overallRating, foodRating, staffRating, comment } = body;
    const normalizedComment = typeof comment === "string" ? comment.trim() : "";
    const ratings = [overallRating, foodRating, staffRating];

    if (
        typeof restaurantId !== "string" ||
        typeof tableId !== "string" ||
        !mongoose.Types.ObjectId.isValid(restaurantId) ||
        !mongoose.Types.ObjectId.isValid(tableId) ||
        ratings.some((value) => !Number.isInteger(value) || value === undefined || value < 1 || value > 5) ||
        normalizedComment.length > 2_000
    ) {
        return NextResponse.json({ error: "Değerlendirme bilgileri geçersiz." }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const table = await Table.findOne({
            _id: tableId,
            restaurantId,
            isActive: true,
        })
            .select("_id")
            .lean();

        if (!table) {
            return NextResponse.json({ error: "Bu masa bağlantısı artık aktif değil." }, { status: 404 });
        }

        if (await isRateLimited(request, tableId)) {
            return NextResponse.json(
                { error: "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin." },
                { status: 429 },
            );
        }

        await Rating.create({
            restaurantId,
            tableId,
            overallRating,
            foodRating,
            staffRating,
            comment: normalizedComment || undefined,
            isAnonymous: true,
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Rating creation failed.", error);
        return NextResponse.json({ error: "Değerlendirme kaydedilemedi." }, { status: 500 });
    }
}
