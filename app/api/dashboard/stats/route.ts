import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  revenue: number;
  revenueTrend: number;
}

export async function GET() {
  // Added underscore to suppress unused variable warning
  try {
    const [totalProducts, totalOrders, totalCustomers, revenue] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.customer.count(),
        prisma.order.aggregate({
          _sum: {
            total: true,
          },
          where: {
            status: "DELIVERED",
          },
        }),
      ]);

    // Calculate revenue trend (compare with last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const previousRevenue = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: "DELIVERED",
        createdAt: {
          lt: new Date(),
          gte: lastMonth,
        },
      },
    });

    const currentRevenue = revenue._sum.total || 0;
    const lastMonthRevenue = previousRevenue._sum.total || 0;
    const revenueTrend = lastMonthRevenue
      ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    const response: DashboardStats = {
      totalProducts,
      totalOrders,
      totalCustomers,
      revenue: currentRevenue,
      revenueTrend: Math.round(revenueTrend),
    };

    return Response.json(response);
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return Response.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
