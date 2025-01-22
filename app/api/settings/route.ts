// app/api/settings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        organization: {
          include: {
            settings: true,
          },
        },
      },
    });

    return NextResponse.json(user?.organization.settings);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { lowStockThreshold, currency, notificationEmail, metadata } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { organizationId: true },
    });

    const settings = await prisma.settings.upsert({
      where: {
        organizationId: user!.organizationId,
      },
      update: {
        lowStockThreshold,
        currency,
        notificationEmail,
        metadata,
      },
      create: {
        organizationId: user!.organizationId,
        lowStockThreshold,
        currency,
        notificationEmail,
        metadata,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
