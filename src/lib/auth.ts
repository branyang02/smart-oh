import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
    return {
        adapter: DrizzleAdapter(db),
        providers: [GitHub, Google]
    };
});
