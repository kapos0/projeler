import mongoose from "mongoose"

let isConnected = false
export default async function connectMongoDB() {
    mongoose.set("strictQuery", true)
    if (isConnected) {
        console.log("MongoDB is already connected")
        return
    }
    try {
        await mongoose.connect(process.env.mongoDBURI_LOCAL)
        isConnected = true
        console.log("MongoDB connected")
    } catch (error) {
        console.error(`Error connection to mongoDB: ${error.message}`)
        process.exit(1)
    }
}
