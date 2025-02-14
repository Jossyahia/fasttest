import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

// Define allowed roles
const UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
  PARTNER: "PARTNER",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];

interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<Response> {
  try {
    const { userId } = await params;
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Parse and validate request body
    const body: UpdateUserRequest = await request.json();
    const { name, role } = body;

    if (!name || !role) {
      return new Response(
        JSON.stringify({ error: "Name and role are required" }),
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !allowedRoles.includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role specified" }), {
        status: 400,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: session.user.organizationId,
      },
    });

    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, role },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[USER_UPDATE]", error);
    return new Response(JSON.stringify({ error: "Internal Error" }), {
      status: 500,
    });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<Response> {
  try {
    const { userId } = await params;
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: session.user.organizationId,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    await prisma.user.delete({ where: { id: userId } });

    return new Response(
      JSON.stringify({ message: "User deleted successfully" })
    );
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new Response(JSON.stringify({ error: "Internal Error" }), {
      status: 500,
    });
  }
}
