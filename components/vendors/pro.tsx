"use client";

import React, { useState, useEffect } from "react";
import { Product, InventoryStatus } from "@prisma/client";
import { createProduct, updateProduct } from "@/lib/api/products";
import { toast } from "react-hot-toast";
import { useWarehouses } from "@/hooks/useWarehouses";
import { useVendors } from "@/hooks/useVendors";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onUpdate: () => void;
  initialVendorId?: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  onUpdate,
  initialVendorId,
}: ProductModalProps) {
  const { warehouses, isLoading: warehousesLoading } = useWarehouses();
  const { vendors, isLoading: vendorsLoading } = useVendors();

  const [formData, setFormData] = useState({
    sku: product?.sku || "",
    name: product?.name || "",
    description: product?.description || "",
    quantity: product?.quantity || 0,
    minStock: product?.minStock || 10,
    status: product?.status || InventoryStatus.ACTIVE,
    location: product?.location || "",
    warehouseId: product?.warehouseId || "",
    vendorId: product?.vendorId || initialVendorId || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [initialWarehouseSet, setInitialWarehouseSet] = useState(false);
  const [initialVendorSet, setInitialVendorSet] = useState(!!initialVendorId);

  useEffect(() => {
    if (warehouses.length > 0 && !initialWarehouseSet) {
      setFormData((prev) => ({
        ...prev,
        warehouseId: product?.warehouseId || warehouses[0].id,
      }));
      setInitialWarehouseSet(true);
    }
  }, [warehouses, product, initialWarehouseSet]);

  useEffect(() => {
    if (vendors.length > 0 && !initialVendorSet && !initialVendorId) {
      setFormData((prev) => ({
        ...prev,
        vendorId: product?.vendorId || vendors[0].id,
      }));
      setInitialVendorSet(true);
    }
  }, [vendors, product, initialVendorSet, initialVendorId]);

  const handleQuantityChange = (
    value: number,
    field: "quantity" | "minStock"
  ) => {
    if (value < 0) return;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const incrementValue = (field: "quantity" | "minStock") => {
    const currentValue =
      field === "quantity" ? formData.quantity : formData.minStock;
    handleQuantityChange(currentValue + 1, field);
  };

  const decrementValue = (field: "quantity" | "minStock") => {
    const currentValue =
      field === "quantity" ? formData.quantity : formData.minStock;
    if (currentValue > 0) {
      handleQuantityChange(currentValue - 1, field);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.warehouseId) {
        throw new Error("Please select a warehouse");
      }
      if (!formData.vendorId) {
        throw new Error("Please select a vendor");
      }

      const payload = {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        warehouseId: formData.warehouseId,
        vendorId: formData.vendorId,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
            aria-label="Close"
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

        <div className="p-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="block w-full rounded-md border border-gray-300 p-2"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor*
                </label>
                <select
                  value={formData.vendorId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vendorId: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border border-gray-300 p-2"
                  required
                  disabled={vendorsLoading || !!initialVendorId}
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
                {!vendorsLoading && vendors.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    No vendors available. Please create a vendor first.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="block w-full rounded-md border border-gray-300 p-2"
                required
              >
                {Object.values(InventoryStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU*
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sku: e.target.value }))
                  }
                  className="block w-full rounded-md border border-gray-300 p-2"
                  required
                  placeholder="Enter SKU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name*
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="block w-full rounded-md border border-gray-300 p-2"
                  required
                  placeholder="Enter product name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="block w-full rounded-md border border-gray-300 p-2"
                rows={3}
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity*
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => decrementValue("quantity")}
                    className="px-3 py-2 bg-gray-100 rounded-l-md border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Decrease quantity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        parseInt(e.target.value) || 0,
                        "quantity"
                      )
                    }
                    className="block w-full border-y border-gray-300 p-2 text-center"
                    min="0"
                    required
                    aria-label="Quantity value"
                    aria-describedby="quantity-helper"
                  />
                  <button
                    type="button"
                    onClick={() => incrementValue("quantity")}
                    className="px-3 py-2 bg-gray-100 rounded-r-md border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Increase quantity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
                <p id="quantity-helper" className="text-xs text-gray-500 mt-1">
                  Current inventory level
                </p>
              </div>

              <div>
                <label
                  htmlFor="minStock"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Min Stock*
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => decrementValue("minStock")}
                    className="px-3 py-2 bg-gray-100 rounded-l-md border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Decrease minimum stock"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) =>
                      handleQuantityChange(
                        parseInt(e.target.value) || 0,
                        "minStock"
                      )
                    }
                    className="block w-full border-y border-gray-300 p-2 text-center"
                    min="0"
                    required
                    aria-label="Minimum stock value"
                    aria-describedby="minstock-helper"
                  />
                  <button
                    type="button"
                    onClick={() => incrementValue("minStock")}
                    className="px-3 py-2 bg-gray-100 rounded-r-md border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Increase minimum stock"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
                <p id="minstock-helper" className="text-xs text-gray-500 mt-1">
                  Alerts will trigger when below this level
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                className="block w-full rounded-md border border-gray-300 p-2"
                placeholder="Enter storage location"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2 pt-4 border-t mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 mt-2 sm:mt-0 w-full sm:w-auto"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto"
                disabled={
                  loading ||
                  warehousesLoading ||
                  vendorsLoading ||
                  warehouses.length === 0 ||
                  vendors.length === 0 ||
                  !formData.warehouseId ||
                  !formData.vendorId
                }
              >
                {loading ? "Saving..." : product ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
