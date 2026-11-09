import mongoose, { Schema, Document } from "mongoose";

export interface IFular extends Document {
    title: string;
    creator: string;
    mediaType?: string;
    category?: string;
    columnId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    userId: string;
    order: number;
    rating?: string;
    mediaUrl?: string;
    actionDate?: Date;
    tags?: string[];
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const FularSchema = new Schema<IFular>(
    {
        title: {
            type: String,
            required: true,
        },
        creator: {
            type: String,
            required: true,
        },
        mediaType: {
            type: String,
            default: "Diğer",
        },
        category: {
            type: String,
        },
        columnId: {
            type: Schema.Types.ObjectId,
            ref: "Column",
            required: true,
            index: true,
        },
        boardId: {
            type: Schema.Types.ObjectId,
            ref: "Board",
            required: true,
            index: true,
        },
        userId: {
            type: String,
            required: true,
            index: true,
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
        rating: {
            type: String,
        },
        mediaUrl: {
            type: String,
        },
        actionDate: {
            type: Date,
        },
        tags: [
            {
                type: String,
            },
        ],
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

FularSchema.index({ userId: 1, boardId: 1, order: 1, createdAt: -1 });
FularSchema.index({ columnId: 1, order: 1 });

export default mongoose.models.Fular ||
    mongoose.model<IFular>("Fular", FularSchema);
