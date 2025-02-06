// app/api/reports/summary/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subDays, subMonths } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "month";

    let startDate = new Date();
    let previousStartDate = new Date();

    switch (range) {
      case "week":
        startDate = subDays(new Date(), 7);
        previousStartDate = subDays(startDate, 7);
        break;
      case "month":
        startDate = subDays(new Date(), 30);
        previousStartDate = subDays(startDate, 30);
        break;
      case "year":
        startDate = subMonths(new Date(), 12);
        previousStartDate = subMonths(startDate, 12);
        break;
    }

    // Current period statistics
    const [totalSales, totalOrders, newCustomers, lowStockItems] =
      await Promise.all([
        // Total sales
        prisma.order.aggregate({
          where: {
            createdAt: {
              gte: startDate,
            },
            status: {
              not: "CANCELLED",
            },
          },
          _sum: {
            total: true,
          },
        }),

        // Total orders
        prisma.order.count({
          where: {
            createdAt: {
              gte: startDate,
            },
            status: {
              not: "CANCELLED",
            },
          },
        }),

        // New customers
        prisma.customer.count({
          where: {
            createdAt: {
              gte: startDate,
            },
          },
        }),

        // Low stock items
        prisma.product.count({
          where: {
            quantity: {
              lte: prisma.product.fields.minStock,
            },
          },
        }),
      ]);

    // Previous period statistics for trend calculation
    const [previousSales, previousOrders, previousCustomers] =
      await Promise.all([
        prisma.order.aggregate({
          where: {
            createdAt: {
              gte: previousStartDate,
              lt: startDate,
            },
            status: {
              not: "CANCELLED",
            },
          },
          _sum: {
            total: true,
          },
        }),

        prisma.order.count({
          where: {
            createdAt: {
              gte: previousStartDate,
              lt: startDate,
            },
            status: {
              not: "CANCELLED",
            },
          },
        }),

        prisma.customer.count({
          where: {
            createdAt: {
              gte: previousStartDate,
              lt: startDate,
            },
          },
        }),
      ]);

    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return 100;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    return NextResponse.json({
      totalSales: totalSales._sum.total || 0,
      totalOrders,
      newCustomers,
      lowStockItems,
      salesTrend: calculateTrend(
        totalSales._sum.total || 0,
        previousSales._sum.total || 0
      ),
      ordersTrend: calculateTrend(totalOrders, previousOrders),
      customersTrend: calculateTrend(newCustomers, previousCustomers),
    });
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
