// components/warehouses/warehouse-list.tsx
"use client";

import { useOptimistic, useTransition } from "react";
import { Warehouse } from "@prisma/client";
import { deleteWarehouse } from "@/app/actions/warehouse";
import { WarehouseCard } from "./warehouse-card";

interface WarehouseListProps {
  initialData: Warehouse[];
}

export default function WarehouseList({ initialData }: WarehouseListProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticWarehouses, addOptimisticWarehouse] = useOptimistic(
    initialData,
    (state, deletedId: string) =>
      state.filter((warehouse) => warehouse.id !== deletedId)
  );

  async function handleDelete(id: string) {
    startTransition(async () => {
      try {
        addOptimisticWarehouse(id);
        await deleteWarehouse(id);
      } catch (error) {
        // You might want to refresh the page or handle the error differently
        console.error("Failed to delete warehouse:", error);
      }
    });
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {optimisticWarehouses.map((warehouse) => (
        <WarehouseCard
          key={warehouse.id}
          warehouse={warehouse}
          onDelete={handleDelete}
          disabled={isPending}
        />
      ))}
    </div>
  );
}
