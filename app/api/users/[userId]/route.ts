import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client"; // Ensure Prisma client is generated!

// Define allowed roles from Prisma
const allowedRoles = Object.values(UserRole);

interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
}

/**
 * Update User API Handler (PUT)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<Response> {
  try {
    const { userId } = params;
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Parse request body
    const body: UpdateUserRequest = await request.json();
    const { name, role } = body;

    // Validate input
    if (!name || !role) {
      return new Response(
        JSON.stringify({ error: "Name and role are required" }),
        { status: 400 }
      );
    }

    // Validate role against Prisma UserRole enum
    if (!allowedRoles.includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role specified" }), {
        status: 400,
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { id: userId, organizationId: session.user.organizationId },
    });

    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, role },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[USER_UPDATE]", error);
    return new Response(JSON.stringify({ error: "Internal Error" }), {
      status: 500,
    });
  }
}

/**
 * Delete User API Handler (DELETE)
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<Response> {
  try {
    const { userId } = params;
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId: session.user.organizationId },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Delete user
    await prisma.user.delete({ where: { id: userId } });

    return new Response(
      JSON.stringify({ message: "User deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new Response(JSON.stringify({ error: "Internal Error" }), {
      status: 500,
    });
  }
}
