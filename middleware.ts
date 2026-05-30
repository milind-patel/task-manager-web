import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    // Protected routes
    const isProtectedRoute = request.nextUrl
        .pathname.startsWith("/dashboard");

    // Auth routes (login/register)
    const isAuthRoute =
        request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/register";

    // If accessing protected route without token
    // → redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL(
            "/login",
            request.url
        );
        return NextResponse.redirect(loginUrl);
    }

    // If accessing login page with valid token
    // → redirect to dashboard
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