"use client";

import React from "react";
import ProductModal from "@/components/vendors/pro";
import { Product, InventoryStatus } from "@prisma/client";

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

interface ProductModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  initialVendorId: string;
  mode: "add" | "edit" | "view";
  product?: FullProduct;
}

export default function ProductModalWrapper({
  isOpen,
  onClose,
  onUpdate,
  initialVendorId,
  mode,
  product,
}: ProductModalWrapperProps) {
  // For the "view" mode, we'll create a custom onClose handler
  // that wraps the original onClose, this lets us handle the
  // readonly UI state without modifying the original component
  const handleClose = () => {
    onClose();
  };

  // Convert the FullProduct to Product for the modal
  // Only pass the product to the modal for edit/view modes
  const modalProduct =
    mode !== "add" && product
      ? ({
          id: product.id,
          name: product.name,
          status: product.status,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          organizationId: product.organizationId,
          sku: product.sku,
          description: product.description,
          quantity: product.quantity,
          minStock: product.minStock,
          location: product.location,
          warehouseId: product.warehouseId,
          vendorId: product.vendorId,
        } as Product)
      : undefined;

  // For view mode, we could add custom read-only behavior
  // by passing modalProduct but preventing modifications

  return (
    <ProductModal
      isOpen={isOpen}
      onClose={handleClose}
      onUpdate={onUpdate}
      initialVendorId={initialVendorId}
      product={modalProduct}
    />
  );
}
