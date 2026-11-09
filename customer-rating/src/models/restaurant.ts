import { Schema, model, models } from "mongoose";

const restaurantSchema = new Schema(
    {
        ownerId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            maxlength: 80,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    { timestamps: true },
);

export const Restaurant = models.Restaurant || model("Restaurant", restaurantSchema);
