import mongoose from "mongoose";
import { env } from "@/lib/env";

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
    _mongoose?: MongooseCache;
};

const cached = globalWithMongoose._mongoose ?? {
    conn: null,
    promise: null,
};

globalWithMongoose._mongoose = cached;

export async function connectToDatabase(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(env.mongodbUri, { dbName: env.mongodbDbName })
            .catch((error: unknown) => {
                cached.promise = null;
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
