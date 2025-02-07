// User Types
export type UserRole = "student" | "TA" | "instructor";

export type User = {
    userId: string;
    name: string;
    email: string;
    avatarUrl: string;
}

export type Class = {
    classId: string;
    name: string;
    number: string;
    semester: string;
    createdAt: Date;
}

export type UserClass = {
    user: User;
    role: UserRole;
    class?: Class;
}
