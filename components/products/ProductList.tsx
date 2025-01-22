"use client";

import { useCallback, useState, memo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductTable from "./ProductTable";
import { ProductFilter } from "./ProductFilter";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@prisma/client";
import { ErrorBoundary } from "react-error-boundary";

const MemoizedProductFilter = memo(ProductFilter);

const LoadingFallback = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
  </div>
);

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
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

  const { data, isLoading, error, mutate } = useProducts({
    page,
    status: searchParams.get("status"),
    search: searchParams.get("search"),
    warehouseId: searchParams.get("warehouseId"),
    lowStock: searchParams.get("lowStock") === "true",
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete product");
        mutate(); // Refresh the data
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
    return <ErrorFallback error={error} resetErrorBoundary={() => mutate()} />;
  }

  return (
    <div className="space-y-4">
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => mutate()}>
        <Suspense fallback={<LoadingFallback />}>
          <MemoizedProductFilter />
          <ProductTable
            products={data?.products ?? []}
            isLoading={isLoading}
            currentPage={page}
            totalPages={data?.pagination?.pages || 1}
            onPageChange={handlePageChange}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
