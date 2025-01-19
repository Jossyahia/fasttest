// // middleware.ts
// import NextAuth from "next-auth";
// import { authConfig } from "./auth";

// export const middleware = NextAuth(authConfig).auth;

// export const config = {
//   matcher: ["/dashboard/:path*", "/settings/:path*"],
// };

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // List of paths that require authentication
  const authRoutes = ["/dashboard", "/settings", "/profile"];
  const adminRoutes = ["/admin"];

  // Get the current path
  const path = request.nextUrl.pathname;

  // Check if the path requires authentication
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));

  // If the route requires authentication and user is not logged in
  if (isAuthRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the route requires admin access and user is not an admin
  if (isAdminRoute && session?.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};
