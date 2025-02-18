// // types/inventory.ts
// import { InventoryStatus, Product, Warehouse } from "@prisma/client";

export interface InventoryItem extends Product {
  warehouse: {
    name: string;
  };
}

export interface InventoryResponse {
  products: InventoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  quantity: number;
  minStock: number;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  warehouse?: {
    name: string;
  };
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export type ProductFormData = {
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  minStock: number;
  location?: string;
  warehouse?: string;
};

export interface ProductActionHandlers {
  view: (product: Product) => void;
  edit: (product: Product) => void;
  delete: (product: Product) => void;
}

