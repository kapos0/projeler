import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { auth } from "./auth";

const authConfig = {
    providers: [],
    callbacks: {
        async authorized({ request }) {
            const user = await auth();
            const protectedPaths = {
                adminOnly: [/\/dashboard/],
                loggedInOnly: [/\/profile/],
            };
            const { pathname } = request.nextUrl;

            // Admin-only paths
            if (protectedPaths.adminOnly.some((p) => p.test(pathname))) {
                return user?.user?.role === "admin";
            }

            // Logged-in-only paths
            if (protectedPaths.loggedInOnly.some((p) => p.test(pathname))) {
                return !!user;
            }

            // Public paths
            return true;
        },
    },
} satisfies NextAuthConfig;

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
    runtime: "nodejs",
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
