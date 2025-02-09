import { db } from "@/db";
import * as schema from "@/db/schema";
import { classes, userClasses, users } from "@/db/schema";
import { reset } from "drizzle-seed";

async function main() {
    if (process.env.TEST_ENV !== "true") {
        throw new Error("This script should only run in test environment");
    }
    await reset(db, schema);
    await seedData();
}

async function seedData() {
    const mockUsers = [
        {
            id: "1",
            name: "Alice Smith",
            email: "alice-smith@gmail.com",
            image: ""
        },
        {
            id: "2",
            name: "Bob Johnson",
            email: "bob.johnson@example.com",
            image: ""
        },
        {
            id: "3",
            name: "Charlie Brown",
            email: "charlie.brown@example.com",
            image: ""
        },
        {
            id: "4",
            name: "David Williams",
            email: "david.williams@example.com",
            image: ""
        },
        {
            id: "5",
            name: "Emma Davis",
            email: "emma.davis@example.com",
            image: ""
        },
        {
            id: "6",
            name: "Frank Miller",
            email: "frank.miller@example.com",
            image: ""
        },
        {
            id: "7",
            name: "Grace Wilson",
            email: "grace.wilson@example.com",
            image: ""
        },
        {
            id: "8",
            name: "Henry Moore",
            email: "henry.moore@example.com",
            image: ""
        },
        {
            id: "9",
            name: "Ivy Clark",
            email: "ivy.clark@example.com",
            image: ""
        },
        {
            id: "10",
            name: "Jack Martinez",
            email: "jack.martinez@example.com",
            image: ""
        },
        {
            id: "11",
            name: "Kate Anderson",
            email: "kate.anderson@example.com",
            image: ""
        },
        {
            id: "12",
            name: "Leo Thomas",
            email: "leo.thomas@example.com",
            image: ""
        },
        {
            id: "13",
            name: "Mia White",
            email: "mia.white@example.com",
            image: ""
        },
        {
            id: "14",
            name: "Nathan Harris",
            email: "nathan.harris@example.com",
            image: ""
        },
        {
            id: "15",
            name: "Olivia Scott",
            email: "olivia.scott@example.com",
            image: ""
        },
        {
            id: "16",
            name: "Peter Lewis",
            email: "peter.lewis@example.com",
            image: ""
        },
        {
            id: "17",
            name: "Quinn Walker",
            email: "quinn.walker@example.com",
            image: ""
        },
        {
            id: "18",
            name: "Rachel Hall",
            email: "rachel.hall@example.com",
            image: ""
        },
        {
            id: "19",
            name: "Samuel Allen",
            email: "samuel.allen@example.com",
            image: ""
        },
        {
            id: "20",
            name: "Tina Young",
            email: "tina.young@example.com",
            image: ""
        }
    ];

    const mockClasses = [
        {
            id: "1",
            name: "Math 101",
            number: "MATH 101",
            semester: "Fall 2021"
        },
        {
            id: "2",
            name: "Computer Science 101",
            number: "CS 101",
            semester: "Fall 2021"
        },
        {
            id: "3",
            name: "Physics 201",
            number: "PHYS 201",
            semester: "Spring 2022"
        },
        {
            id: "4",
            name: "Chemistry 150",
            number: "CHEM 150",
            semester: "Fall 2022"
        },
        {
            id: "5",
            name: "Biology 220",
            number: "BIO 220",
            semester: "Spring 2023"
        }
    ];

    type Role = "student" | "TA" | "instructor";

    const mockUserClasses = [
        { userId: "1", classId: "1", role: "instructor" as Role },
        { userId: "2", classId: "1", role: "instructor" as Role },
        { userId: "3", classId: "2", role: "instructor" as Role },
        { userId: "4", classId: "2", role: "instructor" as Role },
        { userId: "5", classId: "3", role: "instructor" as Role },
        { userId: "6", classId: "3", role: "instructor" as Role },
        { userId: "7", classId: "4", role: "instructor" as Role },
        { userId: "8", classId: "4", role: "instructor" as Role },
        { userId: "9", classId: "5", role: "instructor" as Role },
        { userId: "10", classId: "5", role: "instructor" as Role },

        { userId: "11", classId: "1", role: "TA" as Role },
        { userId: "12", classId: "1", role: "TA" as Role },
        { userId: "13", classId: "1", role: "TA" as Role },
        { userId: "14", classId: "2", role: "TA" as Role },
        { userId: "15", classId: "2", role: "TA" as Role },
        { userId: "16", classId: "2", role: "TA" as Role },
        { userId: "17", classId: "3", role: "TA" as Role },
        { userId: "18", classId: "3", role: "TA" as Role },
        { userId: "19", classId: "3", role: "TA" as Role },
        { userId: "20", classId: "4", role: "TA" as Role },
        { userId: "1", classId: "4", role: "TA" as Role },
        { userId: "2", classId: "4", role: "TA" as Role },
        { userId: "3", classId: "5", role: "TA" as Role },
        { userId: "4", classId: "5", role: "TA" as Role },
        { userId: "5", classId: "5", role: "TA" as Role },

        { userId: "6", classId: "1", role: "student" as Role },
        { userId: "7", classId: "1", role: "student" as Role },
        { userId: "8", classId: "1", role: "student" as Role },
        { userId: "9", classId: "2", role: "student" as Role },
        { userId: "10", classId: "2", role: "student" as Role },
        { userId: "11", classId: "2", role: "student" as Role },
        { userId: "12", classId: "3", role: "student" as Role },
        { userId: "13", classId: "3", role: "student" as Role },
        { userId: "14", classId: "3", role: "student" as Role },
        { userId: "15", classId: "4", role: "student" as Role },
        { userId: "16", classId: "4", role: "student" as Role },
        { userId: "17", classId: "4", role: "student" as Role },
        { userId: "18", classId: "5", role: "student" as Role },
        { userId: "19", classId: "5", role: "student" as Role },
        { userId: "20", classId: "5", role: "student" as Role }
    ];

    await db.insert(users).values(mockUsers);
    await db.insert(classes).values(mockClasses);
    await db.insert(userClasses).values(mockUserClasses);
}

await main();
