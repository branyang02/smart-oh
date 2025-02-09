/**
 * This file contains functions that either retrieve data from 
 * the 'classes' table or write data to it.
 */

import { Class } from "@/types";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { userClasses, classes } from "@/db/schema";

export async function getClasses(): Promise<Class[]> {
    const result = await db.select().from(classes);
    return result;
}

export async function getClassFromClassId(classId: string): Promise<Class | null> {
    const result = await db.select().from(classes).where(eq(classes.id, classId));
    return result[0] || null;
}

export async function getUserClassesFromUserId(userId: string): Promise<(Class & { role: string })[]> {
    const result = await db
        .select({
            id: classes.id,
            name: classes.name,
            number: classes.number,
            semester: classes.semester,
            createdAt: classes.createdAt,
            role: userClasses.role,
        })
        .from(userClasses)
        .innerJoin(classes, eq(userClasses.classId, classes.id))
        .where(eq(userClasses.userId, userId));
    return result;
}