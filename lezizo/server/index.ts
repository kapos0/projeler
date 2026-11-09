import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { Hono } from "hono";
import { auth } from "./auth";
import { searchRecipes } from "./recipes";

const app = new Hono();
app.use(
  "/api/*",
  cors({
    origin: process.env.APP_URL ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.on(["GET", "POST"], "/api/auth/*", (context) =>
  auth.handler(context.req.raw),
);
app.get("/api/recipes/search", async (context) => {
  const result = await searchRecipes(context.req.query("q") ?? "");
  return context.json(result);
});

serve({ fetch: app.fetch, port: Number(process.env.API_PORT ?? 3000) });
console.log("Lezizo API listening on http://localhost:3000");
