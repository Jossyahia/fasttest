import { InventoryStatus } from "./enums";

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  quantity: number;
  minStock: number;
  status: InventoryStatus;
  warehouseId: string;
  location: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  warehouse?: {
    id: string;
    name: string;
    location: string;
  };
}

export interface ProductFilters {
  search?: string;
  status?: InventoryStatus;
  warehouseId?: string;
  lowStock?: boolean;
  page?: number;
}
