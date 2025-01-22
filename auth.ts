// auth.config.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  debug: true, // Enable debug mode to see more detailed logs
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Add this line
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            organization: {
              include: {
                settings: true,
              },
            },
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.error("No email provided by OAuth provider");
        return false;
      }

      try {
        if (account?.provider === "google") {
          console.log("Google sign in attempt for:", user.email);

          // Try to find the user first
          const existingUser = await prisma.user.findFirst({
            where: { email: user.email },
            include: {
              accounts: true,
              organization: true,
            },
          });

          console.log("Existing user check result:", existingUser);

          if (!existingUser) {
            console.log("Creating new user for:", user.email);

            // Create organization first
            const organization = await prisma.organization.create({
              data: {
                name: `${user.name}'s Organization`,
                settings: {
                  create: {
                    lowStockThreshold: 10,
                    currency: "USD",
                  },
                },
              },
            });

            // Create the user
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "Unknown",
                image: user.image,
                emailVerified: new Date(),
                role: "CUSTOMER",
                organizationId: organization.id,
              },
            });

            console.log("New user created:", newUser);
          }

          return true;
        }

        return true;
      } catch (error) {
        console.error("Detailed error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email! },
            include: {
              organization: {
                include: {
                  settings: true,
                },
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
    async session({ session, token }) {
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
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Types
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
}

declare module "next-auth/jwt" {
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
