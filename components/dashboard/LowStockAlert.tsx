"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minStock: number;
}

async function getLowStockItems(): Promise<LowStockItem[]> {
  const response = await fetch("/api/inventory/low-stock", {
    next: {
      revalidate: 300, // Revalidate every 5 minutes
      tags: ["inventory"],
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch low stock items");
  }

  return response.json();
}

export default function LowStockAlert() {
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLowStockItems();
        setLowStockItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load stock items"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Error loading stock alerts: {error}</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (lowStockItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>
        <p className="text-gray-500">No low stock items found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
        <Link href="/inventory" className="text-blue-600 hover:text-blue-800">
          View inventory
        </Link>
      </div>
      <div className="space-y-4">
        {lowStockItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-red-50 rounded-lg"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">SKU: {item.sku}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-red-600">{item.quantity} units</p>
              <p className="text-sm text-gray-500">Min: {item.minStock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
