import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db/index";
import { users, userClasses, classes } from "../db/schema";
import { seed } from "drizzle-seed"


async function seedDB() {
    if (process.env.PROJECT_ENV !== "dev") {
        throw new Error("Database seeding is only allowed in development environment");
    }
    console.log("Seeding smart-oh-dev database...");
    await seed(db, { users, userClasses, classes });
}

seedDB();
