"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Product } from "@prisma/client";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.name}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.status}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                <span>{product.quantity}</span>
                {product.quantity < product.minStock && (
                  <AlertTriangle
                    className="h-4 w-4 ml-2 text-amber-500"
                    aria-label="Low Stock"
                  />
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls (if needed) */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductTable;
