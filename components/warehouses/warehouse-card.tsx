// components/warehouses/warehouse-card.tsx
import { Warehouse } from "@prisma/client";

interface WarehouseCardProps {
  warehouse: Warehouse;
}

export default function WarehouseCard({ warehouse }: WarehouseCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow">
      <h3 className="text-lg font-semibold">{warehouse.name}</h3>
      <p className="text-gray-600">
        {warehouse.location || "No location specified"}
      </p>
      <div className="mt-4 flex justify-end space-x-2">
        <button className="btn-secondary">Edit</button>
        <button className="btn-primary">View Products</button>
      </div>
    </div>
  );
}
