import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
    name: string;
    userId: string;
    columns: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const BoardSchema = new Schema<IBoard>(
    {
        name: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
            index: true,
        },
        columns: [
            {
                type: Schema.Types.ObjectId,
                ref: "Column",
            },
        ],
    },
    {
        timestamps: true,
    },
);

BoardSchema.index(
    { userId: 1, name: 1 },
    { unique: true, partialFilterExpression: { name: "Fular" } },
);

export default mongoose.models.Board ||
    mongoose.model<IBoard>("Board", BoardSchema);
