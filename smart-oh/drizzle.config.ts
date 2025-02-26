import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

let envFile: string;

switch (process.env.PROJECT_ENV) {
  case "production":
    envFile = ".env.production";
    break;
  case "development":
    envFile = ".env.development";
    break;
  case "preview":
    envFile = ".env.preview";
    break;
  case "test":
    envFile = ".env.test";
    break;
  default:
    envFile = ".env.development";
    break;
}

config({ path: envFile });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
