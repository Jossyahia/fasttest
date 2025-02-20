"use client";

import { useState } from "react";
import ProductModal from "./ProductModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";

// Updated Product interface with all required properties
export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  quantity: number;
  minStock: number;
  location: string | null;
  status: InventoryStatus;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  warehouseId: string;
  vendorId: string; // Added missing property
}

export enum InventoryStatus {
  ACTIVE = "ACTIVE",
  SOLD = "SOLD",
  RETURNED = "RETURNED",
}

interface ProductCardProps {
  product: Product;
  onUpdate: () => Promise<void>;
}

export default function ProductCard({ product, onUpdate }: ProductCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: InventoryStatus) => {
    const styles: Record<InventoryStatus, string> = {
      [InventoryStatus.ACTIVE]: "bg-green-100 text-green-800",
      [InventoryStatus.SOLD]: "bg-gray-100 text-gray-800",
      [InventoryStatus.RETURNED]: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      await onUpdate();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <Badge className={getStatusColor(product.status)}>
              {product.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
          {product.description && (
            <p className="text-sm text-gray-700">{product.description}</p>
          )}

          <div className="flex items-center gap-4 mt-3">
            <div className="text-sm">
              <span className="font-medium">Quantity:</span>
              <span
                className={`ml-1 ${
                  product.quantity <= product.minStock ? "text-red-600" : ""
                }`}
              >
                {product.quantity}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Min Stock:</span>
              <span className="ml-1">{product.minStock}</span>
            </div>
          </div>

          {product.location && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Location:</span> {product.location}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 hover:text-red-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </div>

      {isEditModalOpen && (
        <ProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={product}
          onUpdate={onUpdate}
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{product.name}</span> and remove
              it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
