import { reset, seed } from "drizzle-seed";

import { classes, db, users } from "./schema";
import * as schema from "./schema";

export async function seedDb() {
    await seed(db, { users, classes });
}

export async function resetDb() {
    await reset(db, schema);
}
