import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });

import { db } from "../db/index";
import { users, userClasses, classes } from "../db/schema";
import { reset } from "drizzle-seed"


async function resetDB() {
    if (process.env.PROJECT_ENV !== "development") {
        throw new Error("Database resetting is only allowed in development environment");
    }
    console.log("Resetting smart-oh-dev database...");
    await reset(db, { users, userClasses, classes });
}

resetDB();
