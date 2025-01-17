// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth";

export const middleware = NextAuth(authConfig).auth;

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
