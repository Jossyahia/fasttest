import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
//import { Prisma } from "@prisma/client";

// Update the interface to match Prisma's JsonValue type
// interface OrganizationSettings {
//   id?: string;
//   organizationId: string;
//   lowStockThreshold: number;
//   currency: string;
//   notificationEmail: string | null;
//   metadata?: Prisma.JsonValue; // Changed from Record<string, unknown>
// }

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organization: {
          include: {
            settings: true,
          },
        },
      },
    });

    if (!user || !user.organization.settings) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user.organization.settings);
  } catch (error: unknown) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { lowStockThreshold, currency, notificationEmail, metadata } = body;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organization: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedSettings = await prisma.settings.upsert({
      where: { organizationId: user.organization.id },
      update: { lowStockThreshold, currency, notificationEmail, metadata },
      create: {
        organizationId: user.organization.id,
        lowStockThreshold: lowStockThreshold || 10,
        currency: currency || "NGN",
        notificationEmail,
        metadata,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error: unknown) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
