import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hash } from "bcryptjs";

// Define the UserRole enum locally
enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
  PARTNER = "PARTNER",
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error(
      "[USERS_GET]",
      error instanceof Error ? error.message : "Unknown error"
    );
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch users" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();

    // Validate request body
    if (!body || typeof body !== "object") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { name, email, role } = body;

    // Validate required fields
    if (!name || !email || !role) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing required fields",
          details: {
            name: !name ? "Name is required" : null,
            email: !email ? "Email is required" : null,
            role: !role ? "Role is required" : null,
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid role",
          validRoles: Object.values(UserRole),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "User with this email already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate a random password
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
        organization: {
          connect: {
            id: session.user.organizationId,
          },
        },
      },
    });

    // Return success response with user data and temporary password
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      temporaryPassword: password, // In production, this should be sent via email instead
    });
  } catch (error) {
    console.error(
      "[USERS_POST]",
      error instanceof Error ? error.message : "Unknown error"
    );

    // Handle specific Prisma errors
    if (error instanceof Error) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to create user",
          details: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
