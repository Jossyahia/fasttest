import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "CUSTOMER" as UserRole,
        };
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
            organization: true,
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

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: {
              organization: true,
            },
          });

          if (!existingUser) {
            // Create organization with default settings
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

            // Create new user with organization
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                role: "CUSTOMER" as UserRole,
                organizationId: organization.id,
                // Track this signup in activities
                activities: {
                  create: {
                    action: "SIGNUP",
                    details: "User signed up via Google",
                  },
                },
              },
            });
          }
          return true;
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
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
          token.settings = dbUser.organization.settings;
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
        lowStockThreshold: number;
        currency: string;
        notificationEmail?: string | null;
        metadata?: any;
      } | null;
    };
  }
  interface User {
    role: UserRole;
    organizationId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    organizationId: string;
    settings?: {
      lowStockThreshold: number;
      currency: string;
      notificationEmail?: string | null;
      metadata?: any;
    } | null;
  }
}
