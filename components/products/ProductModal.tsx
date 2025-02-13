"use client";

import React, { useState, useEffect } from "react";
import { Product, InventoryStatus } from "@prisma/client";
import { createProduct, updateProduct } from "@/lib/api/products";
import { toast } from "react-hot-toast";
import { useWarehouses } from "@/hooks/useWarehouses";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onUpdate: () => void;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  onUpdate,
}: ProductModalProps) {
  const { warehouses, isLoading: warehousesLoading } = useWarehouses();
  const [formData, setFormData] = useState({
    sku: product?.sku || "",
    name: product?.name || "",
    description: product?.description || "",
    quantity: product?.quantity || 0,
    minStock: product?.minStock || 10,
    status: product?.status || InventoryStatus.ACTIVE,
    location: product?.location || "",
    warehouseId: product?.warehouseId || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [initialWarehouseSet, setInitialWarehouseSet] = useState(false);

  useEffect(() => {
    if (warehouses.length > 0 && !initialWarehouseSet) {
      setFormData((prev) => ({
        ...prev,
        warehouseId: product?.warehouseId || warehouses[0].id,
      }));
      setInitialWarehouseSet(true);
    }
  }, [warehouses, product, initialWarehouseSet]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.warehouseId) {
        throw new Error("Please select a warehouse");
      }

      const payload = {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        warehouseId: formData.warehouseId,
        quantity: Number(formData.quantity),
        minStock: Number(formData.minStock),
        status: formData.status as InventoryStatus,
        location: formData.location.trim(),
      };

      if (product) {
        await updateProduct(product.id, payload);
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload);
        toast.success("Product created successfully");
      }
      onUpdate();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error saving product";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Warehouse*
              </label>
              <select
                value={formData.warehouseId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    warehouseId: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
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
              {!warehousesLoading && warehouses.length === 0 && (
                <p className="text-red-500 text-sm mt-1">
                  No warehouses available. Please create a warehouse first.
                </p>
              )}
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
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
              >
                {Object.values(InventoryStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
                placeholder="Enter SKU"
              />
            </div>

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
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                required
                placeholder="Enter product name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              rows={3}
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity*
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Min Stock*
              </label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minStock: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              placeholder="Enter storage location"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={
                loading ||
                warehousesLoading ||
                warehouses.length === 0 ||
                !formData.warehouseId
              }
            >
              {loading ? "Saving..." : product ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
