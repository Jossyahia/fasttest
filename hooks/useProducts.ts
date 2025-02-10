// hooks/useProducts.ts
import useSWR from "swr";
import { Product, InventoryStatus } from "@prisma/client";

interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    perPage: number;
  };
}

interface ProductFilters {
  page: number;
  status?: InventoryStatus | undefined;
  search?: string | undefined;
  warehouseId?: string | undefined;
  lowStock?: boolean;
}




export function useProducts(filters: ProductFilters) {
  const queryParams = new URLSearchParams({
    page: String(filters.page || 1),
    ...(filters.status && { status: filters.status }),
    ...(filters.search && { search: filters.search }),
    ...(filters.warehouseId && { warehouseId: filters.warehouseId }),
    ...(filters.lowStock && { lowStock: String(filters.lowStock) }),
  }).toString();

  const { data, error, mutate } = useSWR<ProductsResponse>(
    `/api/products?${queryParams}`
  );

  return {
    products: data?.products,
    pagination: data?.pagination,
    isLoading: !error && !data,
    error,
    mutate,
  };
}
