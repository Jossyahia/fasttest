import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

interface WarehouseWithProducts {
  id: string;
  name: string;
  products: {
    quantity: number;
  }[];
}

interface WarehouseMetric {
  name: string;
  totalStock: number;
  movementRate: number;
}

interface GroupedPaymentStats {
  paymentStatus: string;
  _count: {
    _all: number;
  };
  _sum: {
    total: number | null;
  };
}

interface FormattedPaymentStat {
  status: string;
  count: number;
  total: number;
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: "Unauthorized - No organization ID found" },
        { status: 401 }
      );
    }

    const organizationId = session.user.organizationId;

    const defaultStats = {
      salesTrend: [],
      paymentStats: [],
      topCustomers: [],
      inventoryTrends: [],
      activeProducts: [],
      warehouseMetrics: [],
    };

    // Let Prisma infer the return type, then cast to our custom type.
    const rawPaymentStats = await prisma.order.groupBy({
      by: ["paymentStatus"],
      where: { organizationId },
      _count: { _all: true },
      _sum: { total: true },
    });
    const paymentStats = rawPaymentStats as GroupedPaymentStats[];

    const warehouseMetrics: WarehouseWithProducts[] =
      await prisma.warehouse.findMany({
        where: { organizationId },
        select: {
          id: true,
          name: true,
          products: { select: { quantity: true } },
        },
      });

    const formattedWarehouseMetrics: WarehouseMetric[] = warehouseMetrics.map(
      (warehouse) => ({
        name: warehouse.name,
        totalStock: warehouse.products.reduce(
          (sum, p) => sum + (p.quantity || 0),
          0
        ),
        movementRate: 0,
      })
    );

    const formattedPaymentStats: FormattedPaymentStat[] = paymentStats.map(
      (stat) => ({
        status: stat.paymentStatus,
        count: stat._count._all,
        total: stat._sum.total || 0,
      })
    );

    return NextResponse.json({
      ...defaultStats,
      paymentStats: formattedPaymentStats,
      warehouseMetrics: formattedWarehouseMetrics,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
