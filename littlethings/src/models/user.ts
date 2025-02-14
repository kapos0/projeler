import mongoose from "mongoose";

const favSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dateReleased: {
        type: Date,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: false,
        },
        avatar: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: false,
        },
        provider: {
            type: String,
            required: true,
        },
        favs: {
            type: [favSchema],
            default: [],
        },
    },
    { timestamps: true }
);
const User = mongoose.models?.User || mongoose.model("User", userSchema);
export default User;
