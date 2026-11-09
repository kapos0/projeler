import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import "dotenv/config";
import { client, getDatabase } from "./db";

const database = await getDatabase();

export const auth = betterAuth({
  database: mongodbAdapter(database, {
    client,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      displayName: {
        type: "string",
        required: false,
      },
    },
  },
  trustedOrigins: [process.env.APP_URL ?? "http://localhost:5173"],
});
