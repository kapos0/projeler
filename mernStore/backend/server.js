import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import { aj } from "./lib/arcjet.js";
import { connectDB } from "./lib/connectDB.js";

import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();
const __dirname = path.resolve();

app.use(express.json()); //This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.

app.use(cors()); //CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

app.use(
    helmet({
        contentSecurityPolicy: false,
    })
); //helmet is a collection of 14 smaller middleware functions that set security-related HTTP headers
app.use(morgan("dev")); //HTTP request logger middleware for node.js

// apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1, // specifies that each request consumes 1 token
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit())
                res.status(429).json({ error: "Too Many Requests" });
            else if (decision.reason.isBot())
                res.status(403).json({ error: "Bot access denied" });
            else res.status(403).json({ error: "Forbidden" });
            return;
        }

        // check for spoofed bots
        if (
            decision.results.some(
                (result) => result.reason.isBot() && result.reason.isSpoofed()
            )
        ) {
            res.status(403).json({ error: "Spoofed bot detected" });
            return;
        }

        next();
    } catch (error) {
        console.error("Arcjet error", error);
        next(error);
    }
});
app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

//initDB ye ihtiyacım varmı bilmiyorum bence yok
async function initDB() {
    try {
        const result = await connectDB();
        return result;
    } catch (error) {
        console.error("Error: ", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
});
