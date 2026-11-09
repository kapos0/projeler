import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth/minimal";
import { env } from "@/lib/env";
import { mongoClient } from "@/lib/mongodb";

export const auth = betterAuth({
    database: mongodbAdapter(mongoClient.db(env.mongodbDbName)),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [nextCookies()],
    trustedOrigins: [env.betterAuthUrl],
    secret: env.betterAuthSecret,
    baseURL: env.betterAuthUrl,
});
