"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Warehouse } from "@prisma/client";
import WarehouseCard from "./warehouse-card";
import WarehouseListSkeleton from "./warehouse-list-skeleton";
import WarehouseView from "./WarehouseView";
import WarehouseEdit from "./WarehouseEdit";

export default function WarehouseList() {
  const {
    data: warehouses,
    isLoading,
    refetch,
  } = useQuery<Warehouse[]>({
    queryKey: ["warehouses"],
    queryFn: () => fetch("/api/warehouses").then((res) => res.json()),
  });

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [action, setAction] = useState<"view" | "edit" | "delete" | null>(null);

  const closeModal = () => {
    setSelectedWarehouse(null);
    setAction(null);
    refetch();
  };

  if (isLoading) return <WarehouseListSkeleton />;

  return (
    <div className="relative">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {warehouses?.map((warehouse) => (
          <WarehouseCard
            key={warehouse.id}
            warehouse={warehouse}
            onView={() => {
              setSelectedWarehouse(warehouse);
              setAction("view");
            }}
            onEdit={() => {
              setSelectedWarehouse(warehouse);
              setAction("edit");
            }}
            onDelete={() => {
              setSelectedWarehouse(warehouse);
              setAction("delete");
            }}
          />
        ))}
      </div>

      {/* Modal overlay */}
      {selectedWarehouse && action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {action === "view" && (
            <WarehouseView warehouse={selectedWarehouse} onClose={closeModal} />
          )}
          {action === "edit" && (
            <WarehouseEdit warehouse={selectedWarehouse} onClose={closeModal} />
          )}
         
        </div>
      )}
    </div>
  );
}
