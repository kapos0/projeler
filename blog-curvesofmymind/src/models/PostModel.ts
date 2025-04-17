import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            default: "uncategorized",
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export type PostType = {
    _id: string;
    userId: string;
    content: string;
    title: string;
    image: string;
    category: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
};

const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);
export default Post;
