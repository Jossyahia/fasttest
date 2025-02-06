// app/components/dashboard/sales-data.ts
import { prisma } from "@/lib/prisma";
import { SalesData } from "./SalesChart";

export async function fetchSalesData(): Promise<SalesData[]> {
  const currentDate = new Date();
  const sixMonthsAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 5,
    1
  );

  const monthlySales = await prisma.$queryRaw`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month,
      SUM(total) AS revenue,
      COUNT(*) AS orders
    FROM 
      "Order"
    WHERE 
      "createdAt" >= ${sixMonthsAgo}
    GROUP BY 
      month
    ORDER BY 
      MIN("createdAt")
  `;

  return monthlySales as SalesData[];
}
