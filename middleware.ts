import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Retrieve the JWT token from cookies (set during login)
    const token = request.cookies.get("token")?.value;

    // Define routes that require authentication
    const isProtectedRoute = request.nextUrl
        .pathname.startsWith("/dashboard");

    // Define routes that should be inaccessible to authenticated users
    const isAuthRoute =
        request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/register";

    // Enforcement: Redirect unauthenticated users trying to access protected routes
    if (isProtectedRoute && !token) {
        const loginUrl = new URL(
            "/login",
            request.url
        );
        return NextResponse.redirect(loginUrl);
    }

    // Enforcement: Redirect authenticated users away from login/register pages
    if (isAuthRoute && token) {
        const dashboardUrl = new URL(
            "/dashboard",
            request.url
        );
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

// Apply middleware to these routes only
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register"
    ]
};