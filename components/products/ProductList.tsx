"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import ProductHeader from "./ProductHeader";
import ProductFiltersBar from "./ProductFiltersBar";
import { getProducts } from "@/lib/api/products";
import {
  Product,
  ProductFilters,
  SortOption,
  PaginationInfo,
} from "@/types/product";

// Import the InventoryStatus enum from ProductCard
import { InventoryStatus } from "./ProductCard";

// Create a type that matches what ProductCard expects
type ProductCardType = Omit<Product, "status"> & {
  status: InventoryStatus;
};

// Create a type converter function
function convertToProductCardType(product: Product): ProductCardType {
  // Convert the status to the expected enum type
  return {
    ...product,
    status: product.status as unknown as InventoryStatus,
  };
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pages: 1,
    total: 0,
    perPage: 10,
  });
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<SortOption>({
    field: "createdAt",
    direction: "desc",
  });

  const handleFilterChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Fix: Assert that sort.field is a string to match the expected type
      const response = await getProducts(
        { ...filters, page },
        { field: sort.field as string, direction: sort.direction }
      );

      if (!response || !response.products) {
        throw new Error("Invalid response format from API");
      }

      setProducts(response.products);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, filters, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p className="text-red-600 font-medium">{error}</p>
        <Button
          onClick={() => fetchProducts()}
          variant="secondary"
          className="w-24"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductHeader onUpdate={fetchProducts} />

      <ProductFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        sort={sort}
        onSortChange={handleSortChange}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductSkeletons count={6} />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={convertToProductCardType(product)}
              onUpdate={fetchProducts}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No products found</div>
      )}

      {!loading && products.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.pages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

function ProductSkeletons({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 shadow-sm animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-t">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}
