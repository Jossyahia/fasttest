"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function WarehouseEdit() {
  const { id } = useParams();
  const router = useRouter();

  const { data: warehouse, isLoading } = useQuery({
    queryKey: ["warehouse", id],
    queryFn: () => fetch(`/api/warehouses/${id}`).then((res) => res.json()),
  });

  const [name, setName] = useState(warehouse?.name || "");
  const [location, setLocation] = useState(warehouse?.location || "");

  const mutation = useMutation({
    mutationFn: (updatedWarehouse) =>
      fetch(`/api/warehouses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedWarehouse),
      }),
    onSuccess: () => router.push("/warehouses"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name, location });
  };

  if (isLoading) return <p>Loading...</p>;

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
