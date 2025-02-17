export const runtime = "nodejs";

import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Define the UserRole enum locally instead of importing it from "@prisma/client"
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
  PARTNER = "PARTNER",
}

interface CredentialsType {
  email: string;
  password: string;
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as unknown as NextAuthConfig["adapter"],
  debug: false,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>>,
        req: Request
      ) {
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            organization: {
              include: { settings: true },
            },
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        if (!isPasswordValid) {
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }): Promise<boolean> {
      if (!user.email) {
        console.error("No email provided by OAuth provider");
        return false;
      }

      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findFirst({
            where: { email: user.email },
            include: { accounts: true, organization: true },
          });

          if (!existingUser) {
            const organization = await prisma.organization.create({
              data: {
                name: `${user.name}'s Organization`,
                settings: {
                  create: {
                    lowStockThreshold: 10,
                    currency: "NGN",
                  },
                },
              },
            });

            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "Unknown",
                image: user.image,
                emailVerified: new Date(),
                role: "CUSTOMER",
                organizationId: organization.id,
              },
            });
          }
          return true;
        }
        return true;
      } catch (error) {
        console.error("Detailed error in signIn callback:", error);
        return false;
      }
    },
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: any;
      user?: any;
      trigger?: string;
      session?: any;
    }) {
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email! },
            include: {
              organization: {
                include: { settings: true },
              },
            },
          });

          if (dbUser) {
            token.role = dbUser.role;
            token.organizationId = dbUser.organizationId;
            token.settings = dbUser.organization?.settings;
            token.sub = dbUser.id;
          }
        } catch (error) {
          console.error("Error in jwt callback:", error);
        }
      }

      if (trigger === "update" && session?.user) {
        token.role = session.user.role;
        token.organizationId = session.user.organizationId;
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        session.user.organizationId = token.organizationId as string;
        session.user.settings = token.settings;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      organizationId: string;
      settings?: {
        id: string;
        lowStockThreshold: number;
        currency: string;
        notificationEmail?: string | null;
        metadata?: any;
      } | null;
    };
  }

  interface JWT {
    role: UserRole;
    organizationId: string;
    settings?: {
      id: string;
      lowStockThreshold: number;
      currency: string;
      notificationEmail?: string | null;
      metadata?: any;
    } | null;
  }
}
