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

/**
 * Represents user information along with their role and optional class association
 * @interface UserClass
 * @property {User} user - The user object containing user details
 * @property {UserRole} role - The role assigned to the user
 * @property {Class} [class] - Optional class associated with the user
 */
export type UserClass = {
    user: User;
    role: UserRole;
    class?: Class;
}
