import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });
    return NextResponse.json(updatedUser);
  } catch (err: unknown) {
    let errorMessage = "Failed to update profile";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
