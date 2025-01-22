// app/api/inventory/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
      include: {
        warehouse: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ products }); // Return as an object with products array
  } catch (error) {
    console.error("[INVENTORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
