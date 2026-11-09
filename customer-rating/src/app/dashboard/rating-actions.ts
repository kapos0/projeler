"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Rating } from "@/models/rating";
import { Restaurant } from "@/models/restaurant";

export async function deleteRating(formData: FormData): Promise<void> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const ratingId = String(formData.get("ratingId") ?? "");

    if (!session || !mongoose.Types.ObjectId.isValid(ratingId)) {
        throw new Error("Geçersiz değerlendirme veya oturum.");
    }

    try {
        await connectToDatabase();
        const restaurant = await Restaurant.findOne({ ownerId: session.user.id }).select("_id").lean();

        if (!restaurant) {
            throw new Error("İşletme bulunamadı.");
        }

        const deletedRating = await Rating.deleteOne({
            _id: ratingId,
            restaurantId: restaurant._id,
        });

        if (deletedRating.deletedCount !== 1) {
            throw new Error("Değerlendirme bulunamadı.");
        }

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/ratings");
    } catch (error) {
        console.error("Rating deletion failed.", error);
        throw new Error("Değerlendirme silinemedi.");
    }
}
