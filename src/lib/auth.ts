// import NextAuth from "next-auth"

// export const { handlers, signIn, signOut, auth } = NextAuth({
//     providers: [],
// })

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/schema"


export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  return {
    adapter: DrizzleAdapter(db),
    providers: [GitHub, Google],
  }
})