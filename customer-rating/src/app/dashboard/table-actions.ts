"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Restaurant } from "@/models/restaurant";
import { Table } from "@/models/table";
import mongoose from "mongoose";

export type TableActionState = {
    error?: string;
    success?: boolean;
};

export async function createTable(
    _previousState: TableActionState,
    formData: FormData,
): Promise<TableActionState> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { error: "Bu işlemi yapmak için giriş yapmalısınız." };
    }

    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (name.length < 1 || name.length > 50) {
        return { error: "Masa adı 1 ile 50 karakter arasında olmalı." };
    }

    if (description.length > 200) {
        return { error: "Masa açıklaması 200 karakterden uzun olamaz." };
    }

    try {
        await connectToDatabase();
        const restaurant = await Restaurant.findOne({ ownerId: session.user.id }).select("_id").lean();

        if (!restaurant) {
            return { error: "Önce işletmenizi oluşturmalısınız." };
        }

        await Table.create({
            restaurantId: restaurant._id,
            name,
            description: description || undefined,
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Table creation failed.", error);
        return { error: "Masa oluşturulurken bir hata oluştu. Lütfen tekrar deneyin." };
    }
}

export async function updateTable(
        _previousState: TableActionState,
        formData: FormData,
    ): Promise<TableActionState> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { error: "Bu işlemi yapmak için giriş yapmalısınız." };
    }

    const tableId = String(formData.get("tableId") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!mongoose.Types.ObjectId.isValid(tableId)) {
        return { error: "Geçersiz masa." };
    }

    if (name.length < 1 || name.length > 50) {
        return { error: "Masa adı 1 ile 50 karakter arasında olmalı." };
    }

    if (description.length > 200) {
        return { error: "Masa açıklaması 200 karakterden uzun olamaz." };
    }

    try {
        await connectToDatabase();
        const restaurant = await Restaurant.findOne({ ownerId: session.user.id }).select("_id").lean();

        if (!restaurant) {
            return { error: "İşletme bulunamadı." };
        }

        const table = await Table.findOne({
            _id: tableId,
            restaurantId: restaurant._id,
        });

        if (!table) {
            return { error: "Masa bulunamadı." };
        }

        table.name = name;
        table.description = description || undefined;
        await table.save();

        revalidatePath("/dashboard");
        revalidatePath(`/r/${table.publicSlug}`);
        return { success: true };
    } catch (error) {
        console.error("Table update failed.", error);
        return { error: "Masa güncellenirken bir hata oluştu. Lütfen tekrar deneyin." };
    }
}

export async function toggleTableStatus(formData: FormData): Promise<void> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const tableId = String(formData.get("tableId") ?? "");

    if (!session || !mongoose.Types.ObjectId.isValid(tableId)) {
        throw new Error("Geçersiz masa veya oturum.");
    }

    try {
        await connectToDatabase();
        const restaurant = await Restaurant.findOne({ ownerId: session.user.id }).select("_id").lean();

        if (!restaurant) {
            throw new Error("İşletme bulunamadı.");
        }

        const table = await Table.findOne({
            _id: tableId,
            restaurantId: restaurant._id,
        }).select("isActive");

        if (!table) {
            throw new Error("Masa bulunamadı.");
        }

        table.isActive = !table.isActive;
        await table.save();
        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Table status update failed.", error);
        throw new Error("Masa durumu güncellenemedi.");
    }
}
