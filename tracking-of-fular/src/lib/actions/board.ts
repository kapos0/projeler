"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth/auth";
import { Board, Column, Fular } from "@/lib/models";
import initUserBoard from "@/lib/init-user-board";
import { revalidatePath } from "next/cache";

type ActionResult = { error?: string; success?: boolean };

async function getUserId() {
    const session = await getSession();
    return session?.user?.id ?? null;
}

function clean(value: FormDataEntryValue | null) {
    return typeof value === "string" ? value.trim() : "";
}

function validId(value: string) {
    return mongoose.isObjectIdOrHexString(value);
}

function limited(value: string, maxLength: number) {
    return value.length <= maxLength;
}

function parseDate(value: string) {
    if (!value) return undefined;
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) ? null : date;
}

function parseRating(value: string) {
    if (!value) return "";
    return /^[1-5]$/.test(value) ? value : null;
}

function parseMediaUrl(value: string) {
    if (!value) return "";
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:" ? value : null;
    } catch {
        return null;
    }
}

function isDuplicateKeyError(error: unknown): error is { code: 11000 } {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
    );
}

export async function getDashboardData() {
    const userId = await getUserId();
    if (!userId) return null;

    await initUserBoard(userId);
    await connectDB();
    const boards = await Board.find({ userId }).sort({ createdAt: 1 }).lean();
    const boardIds = boards.map((board) => board._id);
    const [columns, fulars] = await Promise.all([
        Column.find({ boardId: { $in: boardIds } }).sort({ order: 1 }).lean(),
        Fular.find({ userId }).sort({ order: 1, createdAt: -1 }).lean(),
    ]);

    return {
        boards: boards.map((board) => ({ id: board._id.toString(), name: board.name })),
        columns: columns.map((column) => ({
            id: column._id.toString(),
            boardId: column.boardId.toString(),
            name: column.name,
            order: column.order,
        })),
        fulars: fulars.map((fular) => ({
            id: fular._id.toString(),
            boardId: fular.boardId.toString(),
            columnId: fular.columnId.toString(),
            title: fular.title,
            creator: fular.creator,
            mediaType: fular.mediaType ?? "Diğer",
            category: fular.category ?? "",
            description: fular.description ?? "",
            rating: fular.rating ?? "",
            mediaUrl: fular.mediaUrl ?? "",
            actionDate: fular.actionDate?.toISOString() ?? "",
            tags: fular.tags ?? [],
            order: fular.order,
        })),
    };
}

export async function createBoard(formData: FormData): Promise<ActionResult> {
    const userId = await getUserId();
    const name = clean(formData.get("name"));
    if (!userId) return { error: "Oturumunuzun süresi dolmuş." };
    if (!name) return { error: "Board adı gerekli." };
    if (!limited(name, 100)) return { error: "Board adı 100 karakteri geçemez." };

    await connectDB();
    try {
        const board = await Board.create({ name, userId, columns: [] });
        const column = await Column.create({ name: "Planlandı", boardId: board._id, order: 0 });
        await Board.updateOne({ _id: board._id, userId }, { $push: { columns: column._id } });
    } catch (error) {
        if (isDuplicateKeyError(error)) return { error: "Bu isimde bir board zaten var." };
        throw error;
    }
    revalidatePath("/dashboard");
    return { success: true };
}

export async function createColumn(formData: FormData): Promise<ActionResult> {
    const userId = await getUserId();
    const boardId = clean(formData.get("boardId"));
    const name = clean(formData.get("name"));
    if (!userId || !boardId || !name) return { error: "Kolon adı gerekli." };
    if (!validId(boardId)) return { error: "Geçersiz board." };
    if (!limited(name, 100)) return { error: "Kolon adı 100 karakteri geçemez." };

    await connectDB();
    const board = await Board.findOne({ _id: boardId, userId });
    if (!board) return { error: "Board bulunamadı." };
    const order = await Column.countDocuments({ boardId });
    let column;
    try {
        column = await Column.create({ name, boardId, order, fulars: [] });
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            return { error: "Bu board'da aynı isimde bir kolon zaten var." };
        }
        throw error;
    }
    await Board.updateOne({ _id: board._id }, { $push: { columns: column._id } });
    revalidatePath("/dashboard");
    return { success: true };
}

export async function createFular(formData: FormData): Promise<ActionResult> {
    const userId = await getUserId();
    const boardId = clean(formData.get("boardId"));
    const columnId = clean(formData.get("columnId"));
    const title = clean(formData.get("title"));
    const creator = clean(formData.get("creator"));
    if (!userId || !boardId || !columnId || !title || !creator) {
        return { error: "Başlık ve üretici bilgisi gerekli." };
    }

    if (!validId(boardId) || !validId(columnId)) {
        return { error: "Geçersiz board veya kolon." };
    }
    if (!limited(title, 200) || !limited(creator, 200)) {
        return { error: "Başlık ve üretici bilgisi 200 karakteri geçemez." };
    }
    const rating = parseRating(clean(formData.get("rating")));
    const mediaUrl = parseMediaUrl(clean(formData.get("mediaUrl")));
    const actionDate = parseDate(clean(formData.get("actionDate")));
    if (rating === null) return { error: "Puan 1 ile 5 arasında olmalıdır." };
    if (mediaUrl === null) return { error: "Geçerli bir medya URL'si girin." };
    if (actionDate === null) return { error: "Geçerli bir tarih girin." };
    if (!limited(clean(formData.get("description")), 2000)) {
        return { error: "Açıklama 2000 karakteri geçemez." };
    }
    if (!limited(clean(formData.get("category")), 100)) {
        return { error: "Kategori 100 karakteri geçemez." };
    }

    await connectDB();
    const column = await Column.findOne({ _id: columnId, boardId });
    if (!column || !(await Board.exists({ _id: boardId, userId }))) {
        return { error: "Geçersiz board veya kolon." };
    }
    const order = await Fular.countDocuments({ columnId });
    const tags = clean(formData.get("tags"))
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    if (tags.length > 20 || tags.some((tag) => !limited(tag, 40))) {
        return { error: "En fazla 20 etiket girebilir, her etiket 40 karakter olabilir." };
    }
    await Fular.create({
        title,
        creator,
        mediaType: clean(formData.get("mediaType")) || "Diğer",
        boardId,
        columnId,
        userId,
        order,
        category: clean(formData.get("category")),
        description: clean(formData.get("description")),
        rating: rating || undefined,
        mediaUrl: mediaUrl || undefined,
        tags,
        actionDate: actionDate || undefined,
    });
    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateFular(formData: FormData): Promise<ActionResult> {
    const userId = await getUserId();
    const fularId = clean(formData.get("fularId"));
    const title = clean(formData.get("title"));
    const creator = clean(formData.get("creator"));
    if (!userId || !validId(fularId) || !title || !creator) return { error: "Başlık ve üretici bilgisi gerekli." };
    if (!limited(title, 200) || !limited(creator, 200)) return { error: "Başlık ve üretici bilgisi 200 karakteri geçemez." };
    const rating = parseRating(clean(formData.get("rating")));
    const mediaUrl = parseMediaUrl(clean(formData.get("mediaUrl")));
    const actionDate = parseDate(clean(formData.get("actionDate")));
    if (rating === null) return { error: "Puan 1 ile 5 arasında olmalıdır." };
    if (mediaUrl === null) return { error: "Geçerli bir medya URL'si girin." };
    if (actionDate === null) return { error: "Geçerli bir tarih girin." };
    if (!limited(clean(formData.get("description")), 2000) || !limited(clean(formData.get("category")), 100)) return { error: "Kategori 100, açıklama 2000 karakteri geçemez." };
    const tags = clean(formData.get("tags")).split(",").map((tag) => tag.trim()).filter(Boolean);
    if (tags.length > 20 || tags.some((tag) => !limited(tag, 40))) return { error: "En fazla 20 etiket girebilir, her etiket 40 karakter olabilir." };
    await connectDB();
    const fular = await Fular.findOne({ _id: fularId, userId });
    if (!fular) return { error: "Fular bulunamadı." };
    Object.assign(fular, {
        title, creator, mediaType: clean(formData.get("mediaType")) || "Diğer",
        category: clean(formData.get("category")), description: clean(formData.get("description")),
        rating: rating || undefined, mediaUrl: mediaUrl || undefined, actionDate: actionDate || undefined, tags,
    });
    await fular.save();
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteBoard(boardId: string): Promise<ActionResult> {
    const userId = await getUserId();
    if (!userId) return { error: "Oturumunuzun süresi dolmuş." };
    if (!validId(boardId)) return { error: "Geçersiz board." };
    await connectDB();
    const board = await Board.findOne({ _id: boardId, userId }).select("_id");
    if (!board) return { error: "Board bulunamadı." };
    await Fular.deleteMany({ boardId: board._id, userId });
    await Column.deleteMany({ boardId: board._id });
    await Board.deleteOne({ _id: board._id, userId });
    revalidatePath("/dashboard");
    return { success: true };
}

export async function moveFular(
    fularId: string,
    columnId: string,
): Promise<ActionResult> {
    const userId = await getUserId();
    if (!userId) return { error: "Oturumunuzun süresi dolmuş." };
    if (!validId(fularId) || !validId(columnId)) {
        return { error: "Geçersiz fular veya kolon." };
    }
    await connectDB();
    const fular = await Fular.findOne({ _id: fularId, userId });
    const column = fular && await Column.findOne({ _id: columnId, boardId: fular.boardId });
    if (!fular || !column) return { error: "Fular veya kolon bulunamadı." };
    const previousColumnId = fular.columnId;
    const previousOrder = fular.order;
    fular.columnId = column._id;
    fular.order = await Fular.countDocuments({ columnId });
    if (!previousColumnId.equals(column._id)) {
        await Fular.updateMany(
            { columnId: previousColumnId, order: { $gt: previousOrder } },
            { $inc: { order: -1 } },
        );
    }
    await fular.save();
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteFular(fularId: string): Promise<ActionResult> {
    const userId = await getUserId();
    if (!userId) return { error: "Oturumunuzun süresi dolmuş." };
    if (!validId(fularId)) return { error: "Geçersiz fular." };
    await connectDB();
    const fular = await Fular.findOne({ _id: fularId, userId }).select("columnId order").lean();
    if (!fular) return { error: "Fular bulunamadı." };
    const result = await Fular.deleteOne({ _id: fularId, userId });
    if (!result.deletedCount) return { error: "Fular bulunamadı." };
    await Fular.updateMany(
        { columnId: fular.columnId, order: { $gt: fular.order } },
        { $inc: { order: -1 } },
    );
    revalidatePath("/dashboard");
    return { success: true };
}
