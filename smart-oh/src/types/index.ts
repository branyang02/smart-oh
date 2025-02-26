export type Role = "student" | "instructor" | "TA"
export type { Class, UserClass } from "@/db/schema";
import { User as SchemaUser } from "@/db/schema";

export type User = SchemaUser & {
    currentColumnId?: string; // Field to store the current column id of the user when interacting with the board
};
