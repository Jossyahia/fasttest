import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// Remove edge runtime configuration
export const dynamic = "force-dynamic";

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minStock: number;
}

export async function GET(request: NextRequest) {
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

    return Response.json(lowStockItems as LowStockItem[]);
  } catch (error) {
    console.error("Low stock items fetch error:", error);
    
    return Response.json(
      { error: "Failed to fetch low stock items" },
      { status: 500 }
    );
  }
}