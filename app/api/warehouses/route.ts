// app/api/warehouses/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const warehouses = await prisma.warehouse.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(warehouses);
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, location } = body;

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        location,
        organization: {
          connect: {
            id: session.user.organizationId,
          },
        },
      },
    });

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error("Error creating warehouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
