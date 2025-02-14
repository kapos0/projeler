import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("MongoDB is already connected");
        return mongoose.connection.getClient();
    }

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: "littleThingsDB",
        });

        isConnected = true;
        console.log("MongoDB connected");

        return connection.connection.getClient();
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}
