// hooks/useProducts.ts
import { useState, useEffect } from "react";
import { Product, InventoryStatus } from "@prisma/client";

interface UseProductsFilters {
  search?: string;
  status?: InventoryStatus;
  warehouseId?: string;
  lowStock?: boolean;
  page?: number;
}

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  refreshProducts: () => Promise<void>;
}

export function useProducts(filters: UseProductsFilters): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set("search", filters.search);
      if (filters.status) queryParams.set("status", filters.status);
      if (filters.warehouseId)
        queryParams.set("warehouseId", filters.warehouseId);
      if (filters.lowStock) queryParams.set("lowStock", "true");
      if (filters.page) queryParams.set("page", filters.page.toString());

      const response = await fetch(`/api/products?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    filters.search,
    filters.status,
    filters.warehouseId,
    filters.lowStock,
    filters.page,
  ]);

  return {
    products,
    isLoading,
    error,
    totalPages,
    refreshProducts: fetchProducts,
  };
}
