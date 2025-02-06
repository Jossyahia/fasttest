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

interface PaymentStat {
  paymentStatus: string;
  _count: number;
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
    // Get the session
    const session = await auth();

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: "Unauthorized - No organization ID found" },
        { status: 401 }
      );
    }

    const organizationId = session.user.organizationId;

    // Initialize empty data structure
    const defaultStats = {
      salesTrend: [],
      paymentStats: [],
      topCustomers: [],
      inventoryTrends: [],
      activeProducts: [],
      warehouseMetrics: [],
    };

    // Get payment status distribution
    const paymentStats: PaymentStat[] = await prisma.order.groupBy({
      by: ["paymentStatus"],
      where: {
        organizationId,
      },
      _count: true,
      _sum: {
        total: true,
      },
    });

    // Get warehouse metrics
    const warehouseMetrics: WarehouseWithProducts[] =
      await prisma.warehouse.findMany({
        where: { organizationId },
        select: {
          id: true,
          name: true,
          products: {
            select: {
              quantity: true,
            },
          },
        },
      });

    // Format warehouse data
    const formattedWarehouseMetrics: WarehouseMetric[] = warehouseMetrics.map(
      (warehouse: WarehouseWithProducts) => ({
        name: warehouse.name,
        totalStock: warehouse.products.reduce(
          (sum, p) => sum + (p.quantity || 0),
          0
        ),
        movementRate: 0, // Default value for now
      })
    );

    // Format payment stats
    const formattedPaymentStats: FormattedPaymentStat[] = paymentStats.map(
      (stat: PaymentStat) => ({
        status: stat.paymentStatus,
        count: stat._count,
        total: stat._sum.total || 0,
      })
    );

    // Return the data
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
