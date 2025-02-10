"use client";

import { useCallback, useState, memo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductTable from "./ProductTable";
import ProductFilter from "./ProductFilter";
import { useProducts } from "@/hooks/useProducts";
import { type Product } from "@/types/product";
import { type InventoryStatus } from "@prisma/client";
import { ErrorBoundary } from "react-error-boundary";
import ProductListSkeleton from "./ProductListSkeleton";

const MemoizedProductFilter = memo(ProductFilter);

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div className="p-4 border border-red-200 rounded-md bg-red-50">
    <h2 className="text-red-800 font-semibold">Something went wrong:</h2>
    <p className="text-red-600">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
    >
      Try again
    </button>
  </div>
);

export function ProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);

  const statusParam = searchParams.get("status") as InventoryStatus | undefined;

  const { products, pagination, isLoading, error, mutate } = useProducts({
    page,
    status: statusParam,
    search: searchParams.get("search") || undefined,
    warehouseId: searchParams.get("warehouseId") || undefined,
    lowStock: searchParams.get("lowStock") === "true",
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: {
      status?: string;
      search?: string;
      warehouseId?: string;
      lowStock?: boolean;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newFilters.status) params.set("status", newFilters.status);
      else params.delete("status");

      if (newFilters.search) params.set("search", newFilters.search);
      else params.delete("search");

      if (newFilters.warehouseId)
        params.set("warehouseId", newFilters.warehouseId);
      else params.delete("warehouseId");

      if (newFilters.lowStock) params.set("lowStock", "true");
      else params.delete("lowStock");

      params.set("page", "1");
      router.push(`?${params.toString()}`);
      setPage(1);
    },
    [router, searchParams]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete product");
        mutate();
      } catch (error) {
        console.error("Delete error:", error);
      }
    },
    [mutate]
  );

  const handleEdit = useCallback(
    (product: Product) => {
      router.push(`/products/edit/${product.id}`);
    },
    [router]
  );

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-600">Error loading products: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => mutate()}>
        <Suspense fallback={<ProductListSkeleton />}>
          <MemoizedProductFilter onFilterChange={handleFilterChange} />
          <ProductTable
            products={products || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={page}
            totalPages={pagination?.pages || 1}
            onPageChange={handlePageChange}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default ProductList;
