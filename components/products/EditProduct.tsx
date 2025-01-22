// components/products/EditProduct.tsx
import { useState } from "react";
import { Product, InventoryStatus } from "@prisma/client";
import { useWarehouses } from "@/hooks/useWarehouses";

interface EditProductProps {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditProduct({
  product,
  onSuccess,
  onCancel,
}: EditProductProps) {
  const [error, setError] = useState<string | null>(null);
  const { warehouses, isLoading: warehousesLoading } = useWarehouses();

  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku,
    quantity: product.quantity,
    minStock: product.minStock ?? 0,
    status: product.status,
    warehouseId: product.warehouseId,
    location: product.location ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          minStock: Number(formData.minStock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update product"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name*
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            SKU*
          </label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, sku: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Warehouse*
          </label>
          <select
            value={formData.warehouseId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, warehouseId: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
            disabled={warehousesLoading}
          >
            <option value="">Select Warehouse</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as InventoryStatus,
              }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DISCONTINUED">Discontinued</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                quantity: parseInt(e.target.value) || 0,
              }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Min Stock
          </label>
          <input
            type="number"
            min="0"
            value={formData.minStock}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                minStock: parseInt(e.target.value) || 0,
              }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Optional location details"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Update Product
        </button>
      </div>
    </form>
  );
}
