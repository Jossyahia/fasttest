//For Vendor
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Warehouse } from "@prisma/client";

interface WarehouseUpdatePayload {
  name: string;
  location: string;
}

export default function WarehouseEdit() {
  const { id } = useParams();
  const router = useRouter();

  const { data: warehouse, isLoading } = useQuery<Warehouse>({
    queryKey: ["warehouse", id],
    queryFn: () => fetch(`/api/warehouses/${id}`).then((res) => res.json()),
  });

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (warehouse) {
      setName(warehouse.name);
      setLocation(warehouse.location ?? "");
    }
  }, [warehouse]);

  const mutation = useMutation<Warehouse, Error, WarehouseUpdatePayload>({
    mutationFn: async (updatedWarehouse: WarehouseUpdatePayload) => {
      const response = await fetch(`/api/warehouses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedWarehouse),
      });
      if (!response.ok) {
        throw new Error("Error updating warehouse");
      }
      return response.json();
    },
    onSuccess: () => router.push("/warehouses"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ name, location });
  };

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Save
      </button>
    </form>
  );
}
