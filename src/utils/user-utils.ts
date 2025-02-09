import { auth } from "@/lib/auth";
import { User } from "@/types";

export async function getUser(): Promise<User> {
    const session = await auth();
    return {
        id: session?.user?.id || "guest-id",
        name: session?.user?.name || "Guest",
        email: session?.user?.email || "guest@example.com",
        image: session?.user?.image || ""
    };
}