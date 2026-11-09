import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import initUserBoard from "../init-user-board";

const mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) {
    throw new Error("MONGODB_URI is required to initialize authentication.");
}

const client = new MongoClient(mongodbUri);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60,
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    if (!user) return;
                    await initUserBoard(user.id.toString());
                },
            },
        },
    },
});

export async function getSession(requestHeaders?: HeadersInit) {
    const result = await auth.api.getSession({
        headers: new Headers(requestHeaders ?? (await headers())),
    });

    return result;
}

export async function signOut() {
    const result = await auth.api.signOut({
        headers: await headers(),
    });

    if (result.success) redirect("/sign-in");
}
