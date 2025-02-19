import { Prisma, InventoryStatus } from "@prisma/client";

// Export the InventoryStatus enum for use in other files
export { InventoryStatus };

// Base Product type from Prisma with additional fields
export type Product = Prisma.ProductGetPayload<{}> & {
  warehouse?: {
    id: string;
    name: string;
    location: string;
  };
  vendor?: {
    id: string;
    name: string;
    location: string;
  };
};

// Filter options for product queries
export interface ProductFilters {
  search?: string;
  status?: InventoryStatus;
  warehouseId?: string;
  vendorId?: string; // Add this line
  lowStock?: boolean;
  page?: number;
}

// Sorting options
export interface SortOption {
  field: keyof Product;
  direction: "asc" | "desc";
}

// Pagination information
export interface PaginationInfo {
  currentPage: number;
  pages: number;
  total: number;
  perPage: number;
}

// API response structure for product listings
export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Form data structure for creating/updating products
export interface ProductFormData {
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  minStock: number;
  status: InventoryStatus;
  location?: string;
  warehouseId: string;
  vendorId: string; // Add this line
}

// Select type for filtered queries
export type ProductSelect = Prisma.ProductSelect;

// Include type for related data
export type ProductInclude = Prisma.ProductInclude;
