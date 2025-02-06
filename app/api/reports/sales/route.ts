import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  subDays,
  subMonths,
  format,
  eachDayOfInterval,
  eachMonthOfInterval,
} from "date-fns";

type DateRange = "week" | "month" | "year";

interface OrderData {
  createdAt: Date;
  total: number;
}

interface TrendDataPoint {
  date: string;
  sales: number;
  orders: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") || "month") as DateRange;

    // Initialize variables with default values
    let startDate: Date = new Date();
    let dateFormat: string = "MMM d";
    let interval: Date[] = [];

    // Set date range and format based on range parameter
    switch (range) {
      case "week": {
        startDate = subDays(new Date(), 7);
        dateFormat = "MMM d";
        interval = eachDayOfInterval({ start: startDate, end: new Date() });
        break;
      }
      case "month": {
        startDate = subDays(new Date(), 30);
        dateFormat = "MMM d";
        interval = eachDayOfInterval({ start: startDate, end: new Date() });
        break;
      }
      case "year": {
        startDate = subMonths(new Date(), 12);
        dateFormat = "MMM yyyy";
        interval = eachMonthOfInterval({ start: startDate, end: new Date() });
        break;
      }
      default: {
        // Handle invalid range parameter by defaulting to month
        startDate = subDays(new Date(), 30);
        dateFormat = "MMM d";
        interval = eachDayOfInterval({ start: startDate, end: new Date() });
      }
    }

    // Get sales data
    const orders: OrderData[] = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: {
          not: "CANCELLED",
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    // Process data for chart
    const trend: TrendDataPoint[] = interval.map((date) => {
      const dayOrders = orders.filter((order: OrderData) => {
        const orderDate = new Date(order.createdAt);
        return range === "year"
          ? orderDate.getMonth() === date.getMonth() &&
              orderDate.getFullYear() === date.getFullYear()
          : orderDate.toDateString() === date.toDateString();
      });

      return {
        date: format(date, dateFormat),
        sales: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        orders: dayOrders.length,
      };
    });

    return NextResponse.json({ trend });
  } catch (error) {
    console.error("Failed to fetch sales data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales data" },
      { status: 500 }
    );
  }
}
