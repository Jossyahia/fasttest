import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

// GET all vendors for organization
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const organizationId = session.user.organizationId;

    const vendors = await prisma.vendor.findMany({
      where: {
        organizationId,
        ...(name && { name: { contains: name, mode: "insensitive" } }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(vendors);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST new vendor
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, location } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Vendor name is required" },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.create({
      data: {
        name,
        location: location || null,
        organization: {
          connect: { id: session.user.organizationId },
        },
      },
    });

    await prisma.activity.create({
      data: {
        action: "New Vendor Created",
        details: `Created vendor: ${name} has been created`,
        user: { connect: { id: session.user.id } },
        notifications: {
          create: {
            user: { connect: { id: session.user.id } },
          },
        },
      },
    });

    return NextResponse.json(vendor, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
