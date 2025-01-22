// app/api/warehouses/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const warehouses = await prisma.warehouse.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(warehouses);
  } catch (error) {
    console.error("Failed to fetch warehouses:", error);
    return NextResponse.json(
      { error: "Failed to fetch warehouses" },
      { status: 500 }
    );
  }
}
