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
  // Convert the FullProduct to Product for the modal
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

  return (
    <ProductModal
      isOpen={isOpen}
      onClose={onClose}
      onUpdate={onUpdate}
      initialVendorId={initialVendorId}
      product={modalProduct}
      readOnly={mode === "view"}
      mode={mode}
    />
  );
}
