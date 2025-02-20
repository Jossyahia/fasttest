// app/vendors/[id]/vendor-detail-client.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaCalendar, FaEdit, FaPlus } from "react-icons/fa";
import DeleteVendorButton from "@/components/vendors/DeleteVendorButton";
import { Vendor, Product } from "@prisma/client";
import ProductModal from "./../../../../components/vendors/pro";

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
  const router = useRouter();

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
          <p className="mt-1 text-gray-600">Vendor Details</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/vendors/${vendor.id}/edit`}
            className="flex items-center rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <FaEdit className="mr-2" />
            Edit
          </Link>
          <DeleteVendorButton vendorId={vendor.id} vendorName={vendor.name} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Vendor Information
            </h2>
            <div className="space-y-4">
              {vendor.location && (
                <div>
                  <div className="mb-1 text-sm font-medium text-gray-600">
                    Location
                  </div>
                  <div className="flex items-center text-gray-800">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    {vendor.location}
                  </div>
                </div>
              )}
              <div>
                <div className="mb-1 text-sm font-medium text-gray-600">
                  Added On
                </div>
                <div className="flex items-center text-gray-800">
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
        <div className="col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                <FaPlus className="mr-1" />
                Add Product
              </button>
            </div>
            {vendor.products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                        SKU
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Product Name
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-600">
                        Quantity
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendor.products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {product.sku}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">
                          {product.quantity}
                          {product.quantity < product.minStock && (
                            <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                              Low Stock
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-center text-sm">
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
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                          <Link
                            href={`/products/${product.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-4 rounded-md bg-gray-50 p-6 text-center">
                <p className="text-gray-600">
                  No products from this vendor yet
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <FaPlus className="mr-2" />
                  Add First Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onUpdate={handleUpdate}
          initialVendorId={vendor.id}
        />
      )}
    </div>
  );
}
