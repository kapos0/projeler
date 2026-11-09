import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./src/lib/auth/auth";

export default async function proxy(request: NextRequest) {
    const session = await getSession(request.headers);
    const pathname = request.nextUrl.pathname;
    const isAuthPage =
        pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
    const isProtectedPage =
        pathname.startsWith("/dashboard") || pathname.startsWith("/profile");

    if (isAuthPage && session?.user)
        return NextResponse.redirect(new URL("/dashboard", request.url));

    if (isProtectedPage && !session?.user)
        return NextResponse.redirect(new URL("/sign-in", request.url));

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile", "/sign-in", "/sign-up"],
};
