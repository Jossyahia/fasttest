import { useState, useEffect } from "react";
import { Product, InventoryStatus } from "@prisma/client";

interface ProductFilters {
  page?: number;
  status?: InventoryStatus;
  search?: string;
  warehouseId?: string;
  lowStock?: boolean;
}

export function useProducts({
  page = 1,
  status,
  search,
  warehouseId,
  lowStock,
}: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        ...(status && { status }),
        ...(search && { search }),
        ...(warehouseId && { warehouseId }),
        ...(lowStock && { lowStock: String(lowStock) }),
      });

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, status, search, warehouseId, lowStock]);

  return {
    products,
    isLoading,
    error,
    totalPages,
    refreshProducts: fetchProducts,
  };
}
