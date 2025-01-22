// app/api/users/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hash } from "bcryptjs";

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
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, role } = body;

    // Generate a random password that will be changed on first login
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

    // Here you would typically send an email to the user with their temporary password
    // await sendWelcomeEmail(email, password)

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
