// components/warehouses/WarehouseDetail.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Warehouse } from "@prisma/client";

export default function WarehouseDetail() {
  const { id } = useParams();

  const {
    data: warehouse,
    isLoading,
    error,
  } = useQuery<Warehouse>({
    queryKey: ["warehouse", id],
    queryFn: () =>
      fetch(`/api/warehouses/${id}`).then((res) => {
        if (!res.ok) throw new Error("Error fetching warehouse");
        return res.json();
      }),
  });

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading warehouse</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{warehouse.name}</h1>
      <p className="mt-2 text-gray-600">Location: {warehouse.location}</p>
      {/* You can add more warehouse details here */}
    </div>
  );
}
