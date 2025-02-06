import { Product, InventoryStatus } from "@prisma/client";
import { AlertTriangle, Check, X } from "lucide-react";
import { memo } from "react";
import { ProductTableSkeleton } from "./ProductTableSkeleton";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (product: Product) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const ProductTable = memo(function ProductTable({
  products = [],
  isLoading = false,
  onDelete,
  onEdit,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: ProductTableProps) {
  const getStatusColor = (status: InventoryStatus): string => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      case "DISCONTINUED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to safely render text
  const renderText = (
    value: string | number | null | undefined | object
  ): string => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return "-";
  };

  if (isLoading) {
    return <ProductTableSkeleton />;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No products found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        {/* Desktop view */}
        <table className="min-w-full bg-white rounded-lg overflow-hidden hidden md:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warehouse
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {renderText(product.sku)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <span>{renderText(product.name)}</span>
                    {product.quantity <= (product.minStock ?? 0) && (
                      <AlertTriangle
                        className="h-4 w-4 ml-2 text-amber-500"
                        title="Low Stock"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {renderText(product.quantity)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {renderText(product.status)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof product.location === "object" &&
                  product.location !== null
                    ? renderText(product.location.name)
                    : renderText(product.location)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof product.warehouse === "object" &&
                  product.warehouse !== null
                    ? renderText(product.warehouse.name)
                    : renderText(product.warehouse)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit?.(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete?.(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile view */}
        <div className="md:hidden space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">
                    {renderText(product.name)}
                  </div>
                  <div className="text-sm text-gray-500">
                    SKU: {renderText(product.sku)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit?.(product)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete?.(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Quantity:</span>
                  <span className="ml-1 text-gray-900">
                    {renderText(product.quantity)}
                    {product.quantity <= (product.minStock ?? 0) && (
                      <AlertTriangle
                        className="h-4 w-4 ml-1 text-amber-500 inline"
                        title="Low Stock"
                      />
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {renderText(product.status)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-1 text-gray-900">
                    {typeof product.location === "object" &&
                    product.location !== null
                      ? renderText(product.location.name)
                      : renderText(product.location)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Warehouse:</span>
                  <span className="ml-1 text-gray-900">
                    {typeof product.warehouse === "object" &&
                    product.warehouse !== null
                      ? renderText(product.warehouse.name)
                      : renderText(product.warehouse)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center md:justify-end mt-4">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-white border disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-white border disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
});

export default ProductTable;
