// components/warehouses/warehouse-card.tsx
"use client";

import { Warehouse } from "@prisma/client";
import { useRouter } from "next/navigation";

interface WarehouseCardProps {
  warehouse: Warehouse;
  onEdit?: () => void;
  onDelete?: () => void;
  // If not using modal for view, remove onView and use navigation instead.
}

export default function WarehouseCard({
  warehouse,
  onEdit,
  onDelete,
}: WarehouseCardProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/warehouses/${warehouse.id}`);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold">{warehouse.name}</h2>
      <p className="text-sm text-gray-500">{warehouse.location}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleView}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          View
        </button>
        <button
          onClick={onEdit}
          className="px-2 py-1 bg-yellow-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
