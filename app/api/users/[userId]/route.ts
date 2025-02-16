import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
  PARTNER = "PARTNER",
}

interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
}

function getUserId(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/");
  return segments[segments.length - 1];
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const userId = getUserId(request);
  try {
    const session = await auth();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (
      !existingUser ||
      existingUser.organizationId !== session.user.organizationId
    ) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const userId = getUserId(request);
  try {
    const session = await auth();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateUserRequest = await request.json();
    const { name, role } = body;

    if (!name && !role) {
      return NextResponse.json(
        { error: "At least one field (name or role) is required" },
        { status: 400 }
      );
    }

    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (
      !existingUser ||
      existingUser.organizationId !== session.user.organizationId
    ) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name ?? existingUser.name,
        role: role ?? existingUser.role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
