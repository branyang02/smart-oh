import { createAndJoinClass, getClasses, getClassFromClassId, getUserClassesFromUserId, joinClassFromClassId } from '@/db/classes';
import { getInstructorsFromClassId, getStudentsFromClassId, getTAsFromClassId, getUserFromUserId, getUsers } from '@/db/users';
import { describe } from 'node:test';
import { expect, it, test } from 'vitest';

describe('Database Getters', () => {
    it('getClasses', async () => {
        const classes = await getClasses();
        expect(classes).toBeDefined();
        expect(Array.isArray(classes)).toBe(true);
        expect(classes.length).eql(5);
        const aClass = classes[0];
        expect(aClass).toHaveProperty('id');
        expect(aClass).toHaveProperty('name');
        expect(aClass).toHaveProperty('number');
        expect(aClass).toHaveProperty('semester');
        expect(aClass).toHaveProperty('createdAt');
    });

    it('getClassFromClassId', async () => {
        const classId = "1";
        const aClass = await getClassFromClassId(classId);
        expect(aClass).toBeDefined();
        expect(aClass).toHaveProperty('id');
        expect(aClass).toHaveProperty('name');
        expect(aClass).toHaveProperty('number');
        expect(aClass).toHaveProperty('semester');
        expect(aClass).toHaveProperty('createdAt');
    });

    it('getUserClassesFromUserId', async () => {
        const userId = "1";
        const classes = await getUserClassesFromUserId(userId);
        expect(classes).toBeDefined();
        expect(Array.isArray(classes)).toBe(true);
        expect(classes.length).eq(2)

        const userId2 = "11";
        const classes2 = await getUserClassesFromUserId(userId2);
        expect(classes2).toBeDefined();
        expect(Array.isArray(classes2)).toBe(true);
        expect(classes2.length).eq(2);
    });

    it('getUsers', async () => {
        const users = await getUsers();
        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).eq(20);
    });

    it('getUserFromUserId', async () => {
        const userId = "1";
        const user = await getUserFromUserId(userId);
        expect(user).toBeDefined();
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
    });

    it('getTAsFromClassId', async () => {
        const classId = "1";
        const users = await getTAsFromClassId(classId);
        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).eq(3);
        const userIds = users.map((u) => u.id);
        expect(userIds).toContain("11");
        expect(userIds).toContain("12");
        expect(userIds).toContain("13");
    });

    it('getInstructorsFromClassId', async () => {
        const classId = "1";
        const users = await getInstructorsFromClassId(classId);
        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).eq(2);
        const userIds = users.map((u) => u.id);
        expect(userIds).toContain("1");
        expect(userIds).toContain("2");
    });

    it('getStudentsFromClassId', async () => {
        const classId = "1";
        const users = await getStudentsFromClassId(classId);
        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).eq(3);
        const userIds = users.map((u) => u.id);
        expect(userIds).toContain("6");
        expect(userIds).toContain("7");
        expect(userIds).toContain("8");
    });
});

describe('Database Setters', () => {
    it('createAndJoinClass', async () => {
        await expect(createAndJoinClass("1", "Machine Learning", "ML 1234", "Fall 2021")).resolves.toMatchObject({ name: "Machine Learning", number: "ML 1234", semester: "Fall 2021" });
        await expect(createAndJoinClass("2", "Data Structures", "DS 1234", "Fall 2021")).resolves.toMatchObject({ name: "Data Structures", number: "DS 1234", semester: "Fall 2021" });
        await expect(createAndJoinClass("0", "Data Structures", "DS 1234", "Fall 2021")).rejects.toThrowError('does not exist');
        const classes = await getClasses();
        const mlClass = classes.find(c => c.name === "Machine Learning");
        expect(mlClass).toBeDefined();
        expect(mlClass).toMatchObject({ name: "Machine Learning", number: "ML 1234", semester: "Fall 2021" });
        if (!mlClass) return;
        const mlInstructors = await getInstructorsFromClassId(mlClass.id);
        expect(mlInstructors).toBeDefined();
        expect(mlInstructors.length).eq(1);
        const mlInstructor = mlInstructors[0];
        expect(mlInstructor).toMatchObject({
            id: "1", name: "Alice Smith", email: "alice-smith@gmail.com"
        })
    });

    it('joinClassFromClassId', async () => {
        await expect(joinClassFromClassId("1", "1", "student")).rejects.toThrowError('already in class');
        await expect(joinClassFromClassId("1", "1", "instructor")).rejects.toThrowError('already in class');
        await expect(joinClassFromClassId("1", "4", "TA")).rejects.toThrowError('already in class');
        await expect(joinClassFromClassId("1", "20", "student")).rejects.toThrowError('does not exist');
        await expect(joinClassFromClassId("21", "1", "student")).rejects.toThrowError('does not exist');
        await expect(joinClassFromClassId("1", "5", "student")).resolves.toMatchObject({ userId: "1", classId: "5", role: "student" });
        await expect(joinClassFromClassId("2", "5", "student")).resolves.toMatchObject({ userId: "2", classId: "5", role: "student" });
        await expect(joinClassFromClassId("2", "5", "TA")).rejects.toThrowError('already in class');
    })
})