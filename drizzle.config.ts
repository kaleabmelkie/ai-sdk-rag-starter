import type { Config } from "drizzle-kit";
import "dotenv/config";
import { env } from "./lib/env.mjs";

export default {
  schema: "./lib/db/schema/*",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL!,
    token: env.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
} satisfies Config;
