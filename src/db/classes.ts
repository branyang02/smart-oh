"use server";

/**
 * This file contains functions that either retrieve data from
 * the 'classes' table or write data to it.
 */
import { db } from "@/db";
import { UserClass, classes, userClasses, users } from "@/db/schema";
import { Class, Role } from "@/types";
import { and, eq } from "drizzle-orm";

export async function getClasses(): Promise<Class[]> {
    const result = await db.select().from(classes);
    return result;
}

export async function getClassFromClassId(
    classId: string
): Promise<Class | null> {
    const result = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId));
    return result[0] || null;
}

export async function getUserClassesFromUserId(
    userId: string
): Promise<(Class & { role: Role })[]> {
    const result = await db
        .select({
            id: classes.id,
            name: classes.name,
            number: classes.number,
            semester: classes.semester,
            createdAt: classes.createdAt,
            role: userClasses.role
        })
        .from(userClasses)
        .innerJoin(classes, eq(userClasses.classId, classes.id))
        .where(eq(userClasses.userId, userId));
    return result;
}

export async function createAndJoinClass(
    userId: string,
    name: string,
    number: string,
    semester: string
): Promise<Class> {
    // assert user exists
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0) {
        throw new Error(`User with id ${userId} does not exist.`);
    }
    // create class
    const result = await db
        .insert(classes)
        .values({ name, number, semester })
        .returning();
    // join class as instructor
    await db
        .insert(userClasses)
        .values({ userId, classId: result[0].id, role: "instructor" });
    return result[0];
}

export async function joinClassFromClassId(
    userId: string,
    classId: string,
    role: Role
): Promise<UserClass> {
    // assert user exists
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0) {
        throw new Error(`User with id ${userId} does not exist.`);
    }
    // assert class exists
    const aClass = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId));
    if (aClass.length === 0) {
        throw new Error(`Class with id ${classId} does not exist.`);
    }
    // assert user is not already in class
    const userClass = await db
        .select()
        .from(userClasses)
        .where(
            and(
                eq(userClasses.userId, userId),
                eq(userClasses.classId, classId)
            )
        );
    if (userClass.length > 0) {
        throw new Error(
            `You are already in class with id ${classId} as a ${userClass[0].role}.`
        );
    }
    // insert user into class
    const result = await db
        .insert(userClasses)
        .values({ userId, classId, role })
        .returning();
    return result[0];
}
