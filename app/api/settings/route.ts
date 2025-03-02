// app/api/settings/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
      include: {
        organization: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const settings = await prisma.settings.upsert({
      where: {
        organizationId: user.organizationId,
      },
      update: {
        lowStockThreshold: body.lowStockThreshold,
        currency: body.currency,
        notificationEmail: body.notificationEmail || null,
      },
      create: {
        organizationId: user.organizationId,
        lowStockThreshold: body.lowStockThreshold,
        currency: body.currency,
        notificationEmail: body.notificationEmail || null,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
