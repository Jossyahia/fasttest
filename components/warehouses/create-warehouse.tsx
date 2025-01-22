// components/warehouses/create-warehouse.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateWarehouse() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const createWarehouse = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      setIsOpen(false);
      reset();
    },
  });

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        Add Warehouse
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Warehouse</h2>
            <form
              onSubmit={handleSubmit((data) => createWarehouse.mutate(data))}
            >
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Name</label>
                  <input
                    {...register("name")}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Location</label>
                  <input {...register("location")} className="input-field" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={createWarehouse.isPending}
                  >
                    {createWarehouse.isPending ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
