import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (NODE_ENV === "development") {
    console.log("🛠 Development mode: proxying to Vite frontend");
    app.use(helmet());
    app.use(cors());

    // API endpointlerini önce tanımla
    app.get("/api/hello", (_req: Request, res: Response) => {
        res.json({ message: "Hello from backend API" });
    });

    // Sadece API dışındaki istekleri proxy'le
    app.use(
        /^\/(?!api).*/, // /api ile başlamayanlar
        createProxyMiddleware({
            target: "http://localhost:5173",
            changeOrigin: true,
        })
    );
} else {
    const frontendPath = path.join(__dirname, "../../frontend/dist");
    app.use(express.static(frontendPath));
    app.get("*", (_req: Request, res: Response) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

app.get("/api/hello", (_req: Request, res: Response) => {
    res.json({ message: "Hello from backend API" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
