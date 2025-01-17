"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
  };
  status: string;
  total: number;
  createdAt: string;
}

export default function RecentOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/orders/recent");
      return data as Order[];
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <Link href="/orders" className="text-blue-600 hover:text-blue-800">
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {orders?.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-sm text-gray-500">{order.customer.name}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${order.total.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(order.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
