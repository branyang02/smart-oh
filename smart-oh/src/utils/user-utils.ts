import { auth } from "@/lib/auth";
import { User } from "@/types";

export async function getUser(): Promise<User> {
    const session = await auth();
    const user = session?.user;
    if (!user) {
        throw new Error("User not found");
    }
    if (
        !user?.id ||
        !user?.name ||
        !user?.email ||
        user.id === null ||
        user.name === null ||
        user.email === null
    ) {
        throw new Error("Invalid user");
    }
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        emailVerified: null // We do not implement email verification, however, this field is required for Auth.js
    };
}
