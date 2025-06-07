import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import * as schema from "../drizzle/schema";
import { db } from "../drizzle";

console.log('Initializing better-auth...');

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.userTable,
      session: schema.sessionsTable,
      account: schema.accountsTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    passwordHash: {
      type: 'scrypt', // Default in better-auth@1.2.8
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "qweqweqweasdwqedsa",
  baseURL: 'http://localhost:5000', // Explicitly set for session handling
  logger: {
    level: 'debug', // Enable debug logging for Better Auth
  },
});

console.log('Better-auth initialized successfully');
