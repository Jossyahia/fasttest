import { PrismaClient, Prisma } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Define log levels using Prisma.LogLevel
const developmentLogs: Prisma.LogLevel[] = ["query", "error", "warn"];
const productionLogs: Prisma.LogLevel[] = ["error"];

// Create Prisma client with proper typing
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? developmentLogs : productionLogs,
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
