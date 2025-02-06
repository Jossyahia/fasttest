// components/dashboard/DashboardStats.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  loading?: boolean;
}

const StatsCard = ({ title, value, icon, trend, loading }: StatsCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline">
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
            )}
            {trend && (
              <span
                className={`ml-2 text-sm ${
                  trend > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/stats");
      return data;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Products"
        value={stats?.totalProducts ?? 0}
        icon={<Package className="h-6 w-6 text-blue-600" />}
        loading={isLoading}
      />
      <StatsCard
        title="Total Orders"
        value={stats?.totalOrders ?? 0}
        icon={<ShoppingCart className="h-6 w-6 text-green-600" />}
        loading={isLoading}
      />
      <StatsCard
        title="Total Customers"
        value={stats?.totalCustomers ?? 0}
        icon={<Users className="h-6 w-6 text-purple-600" />}
        loading={isLoading}
      />
      <StatsCard
        title="Revenue"
        value={stats?.revenue ? `$${stats.revenue.toLocaleString()}` : "$0"}
        icon={<DollarSign className="h-6 w-6 text-yellow-600" />}
        trend={stats?.revenueTrend}
        loading={isLoading}
      />
    </div>
  );
}
