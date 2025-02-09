/**
 * This file contains functions that either retrieve data from 
 * the 'users' table or write data to it.
 */

import { User } from "@/types";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { users, userClasses } from "@/db/schema";

export async function getUsers(): Promise<User[]> {
    const result = await db.select().from(users);
    return result;
}

export async function getUserFromUserId(userId: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, userId));
    return result[0] || null;
}

export async function getTAsFromClassId(classId: string): Promise<User[]> {
    return await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            emailVerified: users.emailVerified,
            image: users.image,
        })
        .from(userClasses)
        .innerJoin(users, eq(userClasses.userId, users.id))
        .where(and(eq(userClasses.role, "TA"), eq(userClasses.classId, classId)));
}

export async function getInstructorsFromClassId(classId: string): Promise<User[]> {
    return await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            emailVerified: users.emailVerified,
            image: users.image,
        })
        .from(userClasses)
        .innerJoin(users, eq(userClasses.userId, users.id))
        .where(and(eq(userClasses.role, "instructor"), eq(userClasses.classId, classId)));
}

export async function getStudentsFromClassId(classId: string): Promise<User[]> {
    return await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            emailVerified: users.emailVerified,
            image: users.image,
        })
        .from(userClasses)
        .innerJoin(users, eq(userClasses.userId, users.id))
        .where(and(eq(userClasses.role, "student"), eq(userClasses.classId, classId)));
}