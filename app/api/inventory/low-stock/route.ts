import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";



export async function GET() {
  try {
    const lowStockItems = await prisma.product.findMany({
      where: {
        quantity: {
          lte: prisma.product.fields.minStock,
        },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        quantity: true,
        minStock: true,
      },
      orderBy: {
        quantity: "asc",
      },
      take: 5,
    });

    return Response.json(lowStockItems);
  } catch (error) {
    console.error("Low stock items fetch error:", error);
    return Response.json(
      { error: "Failed to fetch low stock items" },
      { status: 500 }
    );
  }
}
