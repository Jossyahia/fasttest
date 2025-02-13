"use client";

import { useEffect, useState, useCallback } from "react";
import { Product } from "@prisma/client";
import { ProductFilters, SortOption } from "@/types/product";
import ProductCard from "./ProductCard";
import ProductHeader from "./ProductHeader";
import ProductFiltersBar from "./ProductFiltersBar";
import { getProducts } from "@/lib/api/products";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

// Ensure the ProductsResponse type includes the pagination property
import type { ProductsResponse } from "@/types/product";

export default function ProductList() {
  // State declarations
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1); // Properly declared
  const [totalPages, setTotalPages] = useState(1); // Properly declared
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<SortOption>({
    field: "createdAt",
    direction: "desc",
  });

  // In ProductList.tsx - Update the fetchProducts function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Cast the response as ProductsResponse to access pagination
      const data = (await getProducts(filters, sort, page)) as ProductsResponse;

      // Use the pagination data from the API response
      setProducts(data.products);
      setTotalPages(data.pagination.pages); // Use pages from pagination object
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, filters, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleUpdate = async () => {
    await fetchProducts();
  };

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-600 mb-2">{error}</div>
        <button
          onClick={() => fetchProducts()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductHeader onUpdate={handleUpdate} />

      <ProductFiltersBar
        filters={filters}
        onFilterChange={setFilters}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onUpdate={handleUpdate}
              />
            ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700">
          Page {Math.max(1, page)} of {Math.max(1, totalPages)}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 shadow-sm animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
