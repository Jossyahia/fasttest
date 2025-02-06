// types/inventory.ts
import { InventoryStatus, Product, Warehouse } from "@prisma/client";

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
