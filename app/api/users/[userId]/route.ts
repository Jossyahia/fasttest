// app/api/users/[userId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user exists and belongs to the organization
    const user = await prisma.user.findFirst({
      where: {
        id: params.userId,
        organizationId: session.user.organizationId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Delete user
    await prisma.user.delete({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const { name, role } = body;

    if (!name || !role) {
      return new NextResponse("Name and role are required", { status: 400 });
    }

    // Check if user exists and belongs to the organization
    const existingUser = await prisma.user.findFirst({
      where: {
        id: params.userId,
        organizationId: session.user.organizationId,
      },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name,
        role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      console.error("[USER_UPDATE]", error.message);
      return new NextResponse(error.message, { status: 500 });
    }

    console.error("[USER_UPDATE]", "An unknown error occurred");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
