import { Schema, model, models } from "mongoose";

const ratingSchema = new Schema(
    {
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
            index: true,
        },
        tableId: {
            type: Schema.Types.ObjectId,
            ref: "Table",
            required: true,
            index: true,
        },
        overallRating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        foodRating: {
            type: Number,
            min: 1,
            max: 5,
        },
        staffRating: {
            type: Number,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 2_000,
        },
        isAnonymous: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

ratingSchema.index({ restaurantId: 1, createdAt: -1 });

export const Rating = models.Rating || model("Rating", ratingSchema);
