// For Vendor
"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function WarehouseView() {
  const { id } = useParams();

  const { data: warehouse, isLoading } = useQuery({
    queryKey: ["warehouse", id],
    queryFn: () => fetch(`/api/warehouses/${id}`).then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{warehouse.name}</h1>
      <p className="text-gray-600">{warehouse.location}</p>
    </div>
  );
}
