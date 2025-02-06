// export { auth as middleware } from "@/lib/auth";


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
    const session = await auth();

    const publicPaths = ["/login", "/api/auth", "/public"];
    const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path));

    if (!session?.user && !isPublicPath) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)"],
};
