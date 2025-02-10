// components/products/ProductTable.tsx
"use client";

import { type Product } from "@/types/product";
import { InventoryStatus } from "@/types/enums"; // Updated import
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}

const getStatusStyle = (status: Product["status"]) => {
  const styles = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-yellow-100 text-yellow-800",
    DISCONTINUED: "bg-red-100 text-red-800",
  };
  return styles[status] || "";
};

export default function ProductTable({
  products,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
  onEdit,
}: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="w-full p-4 flex justify-center">
        <div className="animate-pulse">Loading products...</div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No products found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-gray-500">{product.sku}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusStyle(product.status)}
                >
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{product.quantity}</span>
                  {product.minStock && product.quantity < product.minStock && (
                    <AlertTriangle
                      className="h-4 w-4 text-amber-500"
                      aria-label="Low Stock"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
