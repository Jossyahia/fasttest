//(For Vendor
import { InventoryStatus, Product as PrismaProduct } from "@prisma/client";
// types/form.ts
export interface WarehouseFormData {
  name: string;
  location: string;
}

// types/warehouse.ts
export interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  quantity: number;
  minStock: number;
  status: InventoryStatus;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  warehouseId: string;
  price?: number; // Make price optional
}
