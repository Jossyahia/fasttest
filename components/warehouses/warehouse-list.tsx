// components/warehouses/warehouse-list.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Warehouse } from "@prisma/client";
import WarehouseCard from "./warehouse-card";
import WarehouseListSkeleton from "./warehouse-list-skeleton";

export default function WarehouseList() {
  const { data: warehouses, isLoading } = useQuery<Warehouse[]>({
    queryKey: ["warehouses"],
    queryFn: () => fetch("/api/warehouses").then((res) => res.json()),
  });

  if (isLoading) return <WarehouseListSkeleton />;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {warehouses?.map((warehouse) => (
        <WarehouseCard key={warehouse.id} warehouse={warehouse} />
      ))}
    </div>
  );
}
