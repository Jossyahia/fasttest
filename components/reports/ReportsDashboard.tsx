// components/reports/ReportsDashboard.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Users,
} from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
}

const SummaryCard = ({ title, value, trend, icon }: SummaryCardProps) => (
  <div className="bg-white rounded-lg p-6 shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        {trend !== undefined && (
          <p
            className={`text-sm mt-1 ${
              trend >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend >= 0 ? "+" : ""}
            {trend}% from last month
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
    </div>
  </div>
);

export default function ReportsDashboard() {
  const [dateRange, setDateRange] = useState("month"); // week, month, year

  // Fetch summary statistics
  const { data: summaryData } = useQuery({
    queryKey: ["reports", "summary", dateRange],
    queryFn: async () => {
      const response = await fetch(`/api/reports/summary?range=${dateRange}`);
      if (!response.ok) throw new Error("Failed to fetch summary");
      return response.json();
    },
  });

  // Fetch sales data
  const { data: salesData } = useQuery({
    queryKey: ["reports", "sales", dateRange],
    queryFn: async () => {
      const response = await fetch(`/api/reports/sales?range=${dateRange}`);
      if (!response.ok) throw new Error("Failed to fetch sales data");
      return response.json();
    },
  });

  // Fetch top products
  const { data: topProducts } = useQuery({
    queryKey: ["reports", "top-products"],
    queryFn: async () => {
      const response = await fetch("/api/reports/top-products");
      if (!response.ok) throw new Error("Failed to fetch top products");
      return response.json();
    },
  });

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-end">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded-md px-3 py-2 bg-white"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last 12 Months</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Sales"
          value={`$${summaryData?.totalSales.toLocaleString()}`}
          trend={summaryData?.salesTrend}
          icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        />
        <SummaryCard
          title="Total Orders"
          value={summaryData?.totalOrders.toLocaleString()}
          trend={summaryData?.ordersTrend}
          icon={<ShoppingBag className="h-6 w-6 text-blue-600" />}
        />
        <SummaryCard
          title="New Customers"
          value={summaryData?.newCustomers.toLocaleString()}
          trend={summaryData?.customersTrend}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />
        <SummaryCard
          title="Low Stock Items"
          value={summaryData?.lowStockItems.toLocaleString()}
          icon={<Package className="h-6 w-6 text-blue-600" />}
        />
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData?.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                name="Sales ($)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#16a34a"
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts?.selling}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#2563eb" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue by Product</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts?.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#16a34a" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
