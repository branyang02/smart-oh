import { auth } from "@/lib/auth";
import { User } from "@/types";

export async function getUser() {
    const session = await auth();
    const user: User = {
        userId: session?.user?.id || "000",
        name: session?.user?.name || "Guest",
        email: session?.user?.email || "guest@example.com",
        avatarUrl: session?.user?.image || ""
    };

    return user;
}