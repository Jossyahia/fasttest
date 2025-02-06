"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Activity } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface PaymentStat {
  status: string;
  total: number;
}

interface WarehouseMetric {
  name: string;
  totalStock: number;
}

interface DashboardData {
  paymentStats: PaymentStat[];
  warehouseMetrics: WarehouseMetric[];
  salesTrend: unknown[];
  topCustomers: unknown[];
  inventoryTrends: unknown[];
  activeProducts: unknown[];
}

const initialStats: DashboardData = {
  paymentStats: [],
  warehouseMetrics: [],
  salesTrend: [],
  topCustomers: [],
  inventoryTrends: [],
  activeProducts: [],
};

const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardData>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (error: unknown) {
        console.error("Failed to fetch stats:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Activity className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Payment Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {stats.paymentStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.paymentStats}
                      dataKey="total"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {stats.paymentStats.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.status}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        `₦${value.toLocaleString()}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    No payment data available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Warehouse Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {stats.warehouseMetrics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.warehouseMetrics}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="totalStock"
                      fill="#3b82f6"
                      name="Total Stock"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    No warehouse data available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Warehouses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.warehouseMetrics.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.warehouseMetrics
                .reduce((sum, w) => sum + w.totalStock, 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.paymentStats.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;
