import express from "express"
import dotenv from "dotenv"
import connectMongoDB from "./lib/db.js"
import cors from "cors"
import booksRoute from "./routes/booksRoute.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json()) //for parsing body data to json
app.use(cors()) //for cross origin resource sharing for the web broser

app.use("/api/books", booksRoute)

app.listen(PORT, () => {
    connectMongoDB()
    console.log("App is listening to port: " + PORT)
})
