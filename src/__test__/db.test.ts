import { getClasses, getClassFromClassId, getUserClassesFromUserId } from '@/db/classes';
import { getInstructorsFromClassId, getStudentsFromClassId, getTAsFromClassId, getUserFromUserId, getUsers } from '@/db/users';
import { describe, expect, it, test } from 'vitest';

test('getClasses', async () => {
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

test('getClassFromClassId', async () => {
    const classId = "1";
    const aClass = await getClassFromClassId(classId);
    expect(aClass).toBeDefined();
    expect(aClass).toHaveProperty('id');
    expect(aClass).toHaveProperty('name');
    expect(aClass).toHaveProperty('number');
    expect(aClass).toHaveProperty('semester');
    expect(aClass).toHaveProperty('createdAt');
});

test('getUserClassesFromUserId', async () => {
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

test('getUsers', async () => {
    const users = await getUsers();
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).eq(20);
});

test('getUserFromUserId', async () => {
    const userId = "1";
    const user = await getUserFromUserId(userId);
    expect(user).toBeDefined();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
});

test('getTAsFromClassId', async () => {
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

test('getInstructorsFromClassId', async () => {
    const classId = "1";
    const users = await getInstructorsFromClassId(classId);
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).eq(2);
    const userIds = users.map((u) => u.id);
    expect(userIds).toContain("1");
    expect(userIds).toContain("2");
});

test('getStudentsFromClassId', async () => {
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