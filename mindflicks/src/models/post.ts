import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: { type: String },
        image: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        comments: [
            {
                content: { type: String, required: true },
                author: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

const Post = mongoose.models?.Post || mongoose.model("Post", PostSchema);
export default Post;
