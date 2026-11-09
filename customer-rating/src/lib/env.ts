function required(name: string): string {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`${name} is not configured.`);
    }

    return value;
}

const betterAuthUrl = required("BETTER_AUTH_URL");

try {
    new URL(betterAuthUrl);
} catch {
    throw new Error("BETTER_AUTH_URL must be a valid absolute URL.");
}

const betterAuthSecret = required("BETTER_AUTH_SECRET");

if (betterAuthSecret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must be at least 32 characters long.");
}

export const env = {
    mongodbUri: required("MONGODB_URI"),
    mongodbDbName: process.env.MONGODB_DB_NAME?.trim() || "active",
    betterAuthSecret,
    betterAuthUrl,
    publicAppUrl: process.env.PUBLIC_APP_URL?.trim() || betterAuthUrl,
    trustProxy: process.env.TRUST_PROXY === "true",
} as const;
