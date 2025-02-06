// User Types
export type UserRole = "student" | "TA" | "instructor";

export type ClassItem = {
    className: string;
    semester: string;
    role: UserRole;
};
