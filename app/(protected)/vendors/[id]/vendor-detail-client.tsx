"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaCalendar,
  FaEdit,
  FaPlus,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import DeleteVendorButton from "@/components/vendors/DeleteVendorButton";
import ProductModalWrapper from "@/components/vendors/ProductModalWrapper";

import { Vendor, Product } from "@prisma/client";

// Define the InventoryStatus enum if it's not available from imports
type InventoryStatus = "ACTIVE" | "SOLD" | "RETURNED";

// Full Product type that matches what ProductModal expects
interface FullProduct {
  id: string;
  name: string;
  status: InventoryStatus;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  sku: string;
  description: string | null;
  quantity: number;
  minStock: number;
  location: string | null;
  warehouseId: string;
  vendorId: string;
}

interface VendorWithProducts extends Vendor {
  products: Pick<
    Product,
    "id" | "sku" | "name" | "quantity" | "status" | "minStock" | "createdAt"
  >[];
}

interface VendorDetailClientProps {
  vendor: VendorWithProducts;
}

export default function VendorDetailClient({
  vendor,
}: VendorDetailClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    FullProduct | undefined
  >(undefined);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const router = useRouter();

  // Convert partial product to full product with default values for missing fields
  const convertToFullProduct = (
    product: Pick<
      Product,
      "id" | "sku" | "name" | "quantity" | "status" | "minStock" | "createdAt"
    >
  ): FullProduct => {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      status: product.status as InventoryStatus,
      quantity: product.quantity,
      minStock: product.minStock,
      createdAt: product.createdAt,
      // Default values for missing fields
      updatedAt: new Date(),
      organizationId: "", // You might need to get this from context or props
      description: null,
      location: null,
      warehouseId: "", // You might need to get this from context or props
      vendorId: vendor.id,
    };
  };

  const handleModalOpen = (
    mode: "add" | "edit" | "view",
    product?: Pick<
      Product,
      "id" | "sku" | "name" | "quantity" | "status" | "minStock" | "createdAt"
    >
  ) => {
    setModalMode(mode);

    if (mode === "add") {
      setSelectedProduct(undefined);
    } else if (product) {
      // Convert the partial product to a full product
      setSelectedProduct(convertToFullProduct(product));
    }

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
  };

  const handleDeleteModalOpen = (product: { id: string; name: string }) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
        handleDeleteModalClose();
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdate = () => {
    router.refresh();
  };

  return (
    <div className="w-full px-4 py-6 md:py-8">
      {/* Header section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {vendor.name}
          </h1>
          <p className="mt-1 text-sm text-gray-600">Vendor Details</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            href={`/vendors/${vendor.id}/edit`}
            className="flex items-center justify-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <FaEdit className="mr-1.5" />
            Edit
          </Link>
          <DeleteVendorButton vendorId={vendor.id} vendorName={vendor.name} />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Vendor info card */}
        <div className="col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Vendor Information
            </h2>
            <div className="space-y-4">
              {vendor.location && (
                <div>
                  <div className="mb-1 text-sm font-medium text-gray-600">
                    Location
                  </div>
                  <div className="flex items-center text-gray-800 text-sm sm:text-base">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    {vendor.location}
                  </div>
                </div>
              )}
              <div>
                <div className="mb-1 text-sm font-medium text-gray-600">
                  Added On
                </div>
                <div className="flex items-center text-gray-800 text-sm sm:text-base">
                  <FaCalendar className="mr-2 text-gray-400" />
                  {new Date(vendor.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm font-medium text-gray-600">
                  Products Count
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  {vendor.products.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products section */}
        <div className="col-span-1 lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
              <button
                onClick={() => handleModalOpen("add")}
                className="flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                <FaPlus className="mr-1" />
                Add Product
              </button>
            </div>

            {vendor.products.length > 0 ? (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            SKU
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Product Name
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Qty
                          </th>
                          <th
                            scope="col"
                            className="hidden sm:table-cell px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {vendor.products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="hidden md:table-cell px-3 py-2.5 text-xs text-gray-500">
                              {product.sku}
                            </td>
                            <td className="px-3 py-2.5 text-sm font-medium text-gray-900">
                              <div className="flex flex-col">
                                {product.name}
                                <span className="md:hidden text-xs text-gray-500 mt-0.5">
                                  SKU: {product.sku}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2.5 text-right text-sm text-gray-700">
                              <div className="flex flex-col items-end">
                                {product.quantity}
                                {product.quantity < product.minStock && (
                                  <span className="mt-0.5 rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700">
                                    Low
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="hidden sm:table-cell px-3 py-2.5 text-center">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  product.status === "ACTIVE"
                                    ? "bg-green-50 text-green-700"
                                    : product.status === "SOLD"
                                    ? "bg-orange-50 text-orange-700"
                                    : "bg-gray-50 text-gray-700"
                                }`}
                              >
                                {product.status}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right text-sm">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() =>
                                    handleModalOpen("view", product)
                                  }
                                  className="text-blue-600 hover:text-blue-800"
                                  aria-label={`View ${product.name}`}
                                >
                                  <FaEye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleModalOpen("edit", product)
                                  }
                                  className="text-indigo-600 hover:text-indigo-800"
                                  aria-label={`Edit ${product.name}`}
                                >
                                  <FaEdit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteModalOpen({
                                      id: product.id,
                                      name: product.name,
                                    })
                                  }
                                  className="text-red-600 hover:text-red-800"
                                  aria-label={`Delete ${product.name}`}
                                >
                                  <FaTrash className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-md bg-gray-50 p-4 sm:p-6 text-center">
                <p className="text-gray-600 text-sm">
                  No products from this vendor yet
                </p>
                <button
                  onClick={() => handleModalOpen("add")}
                  className="mt-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <FaPlus className="mr-1.5" />
                  Add First Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModalWrapper
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onUpdate={handleUpdate}
          initialVendorId={vendor.id}
          mode={modalMode}
          product={selectedProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTrash className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete{" "}
                        <span className="font-medium">
                          {productToDelete.name}
                        </span>
                        ? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleDeleteModalClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
