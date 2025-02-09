import useSWR from "swr";
import { InventoryStatus } from "@prisma/client";

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  status: InventoryStatus; // Ensure correct type
  quantity: number;
  minStock: number;
  location: string | null;
  warehouseId: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
}

interface Pagination {
  pages: number;
  total: number;
}

interface UseProductsReturn {
  products: Product[];
  pagination: Pagination;
  isLoading: boolean;
  error: any;
  refreshProducts: () => void;
  mutate: () => void; // Ensure mutate is included
}

export function useProducts(params: Record<string, any>): UseProductsReturn {
  const { data, error, mutate } = useSWR(
    `/api/products?${new URLSearchParams(params)}`
  );

  return {
    products: (data?.products ?? []).map((product: any) => ({
      ...product,
      status: product.status as InventoryStatus, // Cast status
      createdAt: new Date(product.createdAt), // Convert string to Date
      updatedAt: new Date(product.updatedAt),
    })) as Product[],
    pagination: data?.pagination ?? { pages: 1, total: 0 },
    isLoading: !data && !error,
    error,
    refreshProducts: mutate, // Ensure mutate is exposed
    mutate, // Include mutate in return
  };
}
