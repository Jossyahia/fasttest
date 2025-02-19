// app/api/warehouses/route.ts (For Vendor)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const warehouses = await prisma.warehouse.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
    });

    return NextResponse.json(warehouses);
  } catch (error) {
    console.error("Failed to update notification settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
