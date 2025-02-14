import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        username: { type: String, unique: true, required: true },
        provider: {
            type: String,
            enum: ["credentials", "google", "github"],
            required: true,
        },
        password: { type: String },
        name: { type: String },
        bio: { type: String },
        image: { type: String },
        location: { type: String },
        website: { type: String },
        isVerified: { type: Boolean, default: false },
        posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
        likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
        notifications: [
            {
                creator: { type: Schema.Types.ObjectId, ref: "User" },
                type: {
                    type: String,
                    enum: ["LIKE", "COMMENT", "FOLLOW"],
                    required: true,
                },
                read: { type: Boolean, default: false },
                post: { type: Schema.Types.ObjectId, ref: "Post" },
                commentId: { type: String },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

const User = mongoose.models?.User || mongoose.model("User", UserSchema);
export default User;
