import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db/index";
import { users, userClasses, classes } from "../db/schema";
import { seed } from "drizzle-seed"
import { createId } from "@paralleldrive/cuid2";


async function seedDB() {
    if (process.env.PROJECT_ENV !== "dev") {
        throw new Error("Database seeding is only allowed in development environment");
    }
    console.log("Seeding smart-oh-dev database...");

    const { mockUsers, mockClasses, mockUserClasses } = generateMockData();

    await db.insert(users).values(mockUsers);
    await db.insert(classes).values(mockClasses);
    await db.insert(userClasses).values(mockUserClasses);
}

const generateMockData = () => {
    type Role = "student" | "TA" | "instructor";
    interface User {
        id: string;
        name: string;
        email: string;
        image: string;
    }
    interface Class {
        id: string;
        name: string;
        number: string;
        semester: string;
    }
    interface UserClass {
        userId: string;
        classId: string;
        role: Role;
    }
    // Generate Users
    const totalUsers = 50;
    const mockUsers: User[] = Array.from({ length: totalUsers }, (_, i) => ({
        id: createId(),
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        image: "",
    }));

    // Define Classes
    const mockClasses: Class[] = [
        { id: "class1", name: "Math 101", number: "MATH 101", semester: "Fall 2024" },
        { id: "class2", name: "Computer Science 101", number: "CS 101", semester: "Fall 2024" },
        { id: "class3", name: "Physics 201", number: "PHYS 201", semester: "Spring 2025" },
        { id: "class4", name: "Chemistry 150", number: "CHEM 150", semester: "Fall 2025" },
        { id: "class5", name: "Advanced AI", number: "AI 500", semester: "Spring 2026" } // Special class with many TAs
    ];

    const mockUserClasses: UserClass[] = [];

    // Function to add user to a class if they don't already have a role in it
    const addUserToClass = (userId: string, classId: string, role: Role) => {
        if (!mockUserClasses.some(entry => entry.userId === userId && entry.classId === classId)) {
            mockUserClasses.push({ userId, classId, role });
        }
    };

    // Assign Instructors (1-2 per class, except class5 has 3)
    addUserToClass(mockUsers[0].id, "class1", "instructor");
    addUserToClass(mockUsers[1].id, "class1", "instructor");
    addUserToClass(mockUsers[2].id, "class2", "instructor");
    addUserToClass(mockUsers[3].id, "class2", "instructor");
    addUserToClass(mockUsers[4].id, "class3", "instructor");
    addUserToClass(mockUsers[5].id, "class3", "instructor");
    addUserToClass(mockUsers[6].id, "class4", "instructor");
    addUserToClass(mockUsers[7].id, "class4", "instructor");

    // Class 5 - 3 Instructors
    addUserToClass(mockUsers[8].id, "class5", "instructor");
    addUserToClass(mockUsers[9].id, "class5", "instructor");
    addUserToClass(mockUsers[10].id, "class5", "instructor");

    // Assign 1 TA to each regular class
    addUserToClass(mockUsers[11].id, "class1", "TA");
    addUserToClass(mockUsers[12].id, "class2", "TA");
    addUserToClass(mockUsers[13].id, "class3", "TA");
    addUserToClass(mockUsers[14].id, "class4", "TA");

    // Assign 30 TAs to class5
    for (let i = 15; i < 45; i++) {
        addUserToClass(mockUsers[i].id, "class5", "TA");
    }

    // Assign Students (Each student can be in multiple different classes but not have multiple roles in one class)
    const studentsToAssign = [
        { userId: mockUsers[45].id, classes: ["class1", "class2"] },
        { userId: mockUsers[46].id, classes: ["class2", "class3"] },
        { userId: mockUsers[47].id, classes: ["class3", "class4"] },
        { userId: mockUsers[48].id, classes: ["class4", "class5"] },
        { userId: mockUsers[49].id, classes: ["class1", "class5"] }
    ];

    studentsToAssign.forEach(({ userId, classes }) => {
        classes.forEach(classId => addUserToClass(userId, classId, "student"));
    });

    return { mockUsers, mockClasses, mockUserClasses };
};

seedDB();
