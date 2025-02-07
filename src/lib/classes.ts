import { Class, UserClass } from "@/types";

export async function getUserClassesFromUserId(userId: string): Promise<UserClass[]> {
    // TODO: mock data
    if (userId == "9c80f4be-bb25-4e23-a7fe-4bbfb3f854c7") {
        return [
            {
                user: {
                    userId,
                    name: "Brandon",
                    email: "brandon@example.com",
                    avatarUrl: ""
                },
                role: "student",
                class: {
                    classId: "ml4774",
                    name: "Machine Learning",
                    number: "CS4774",
                    semester: "Fall 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId,
                    name: "Brandon",
                    email: "brandon@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId: "cs2130",
                    name: "Data Structures",
                    number: "CS2130",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId,
                    name: "Brandon",
                    email: "brandon@example.com",
                    avatarUrl: ""
                },
                role: "instructor",
                class: {
                    classId: "cs3100",
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            }
        ];
    }
    return [];
}

export async function getCourseStaffForClassFromClassId(classId: string): Promise<UserClass[]> {
    // TODO: mock data
    if (classId === "cs3100") {
        return [
            {
                user: {
                    userId: "user-ta1",
                    name: "Alice Wonder",
                    email: "alice@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta2",
                    name: "Bob Builder",
                    email: "bob@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta3",
                    name: "Charlie Chaplin",
                    email: "charlie@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta4",
                    name: "David Tennant",
                    email: "david@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta5",
                    name: "Emma Stone",
                    email: "emma@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta6",
                    name: "Frank Ocean",
                    email: "frank@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta7",
                    name: "Grace Hopper",
                    email: "grace@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta8",
                    name: "Harry Potter",
                    email: "harry@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta9",
                    name: "Isabella Garcia",
                    email: "isabella@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta10",
                    name: "Jack Sparrow",
                    email: "jack@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta11",
                    name: "Katherine Johnson",
                    email: "katherine@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta12",
                    name: "Leo Messi",
                    email: "leo@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta13",
                    name: "Monica Geller",
                    email: "monica@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta14",
                    name: "Noah Centineo",
                    email: "noah@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-ta15",
                    name: "Olivia Rodrigo",
                    email: "olivia@example.com",
                    avatarUrl: ""
                },
                role: "TA",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-instructor1",
                    name: "Hank Williams",
                    email: "hank@example.com",
                    avatarUrl: ""
                },
                role: "instructor",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            },
            {
                user: {
                    userId: "user-instructor2",
                    name: "Ivy League",
                    email: "ivy@example.com",
                    avatarUrl: ""
                },
                role: "instructor",
                class: {
                    classId,
                    name: "Software Engineering",
                    number: "CS3100",
                    semester: "Spring 2024",
                    createdAt: new Date()
                }
            }
        ];
    }
    return [];
}

export async function getClassFromClassId(classId: string): Promise<Class | null> {
    if (classId === "cs3100") {
        return {
            classId,
            name: "Software Engineering",
            number: "CS3100",
            semester: "Spring 2024",
            createdAt: new Date()
        };
    } else if (classId === "cs2130") {
        return {
            classId,
            name: "Data Structures",
            number: "CS2130",
            semester: "Spring 2024",
            createdAt: new Date()
        };
    } else if (classId === "ml4774") {
        return {
            classId,
            name: "Machine Learning",
            number: "CS4774",
            semester: "Fall 2024",
            createdAt: new Date()
        };
    }
    return null;
}