"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ProductDetailsDialog } from "./product-details-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { InventoryTableSkeleton } from "./inventory-skeleton";
import { FilterBar } from "./filter-bar";
import { MobileProductCard } from "./mobile-product-card";
import { DesktopTable } from "./desktop-table";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Product, PaginationData } from "@/types/inventory";
import { useDebounce } from "@/hooks/use-debounce";

interface InventoryResponse {
  products: Product[];
  pagination: PaginationData;
}

interface EditProductFormData {
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  minStock: number;
  location?: string;
  warehouse?: string; // This is a string (warehouse ID or name)
}

export function InventoryTable() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Debounce search to prevent excessive API calls
  const debouncedSearch = useDebounce(search, 300);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["products", debouncedSearch, status, page, limit],
    queryFn: async (): Promise<InventoryResponse> => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) searchParams.append("search", debouncedSearch);
      if (status && status !== "all") searchParams.append("status", status);

      const response = await fetch(`/api/inventory?${searchParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch inventory");
      }
      return response.json();
    },
    staleTime: 1000 * 60,
  });
  // Reset page when search or status changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/inventory/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const editMutation = useMutation({
    mutationFn: async (updatedProduct: Product) => {
      const response = await fetch(`/api/inventory/${updatedProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleProductAction = {
    delete: (product: Product) => {
      setSelectedProduct(product);
      setIsDeleteDialogOpen(true);
    },
    edit: (product: Product) => {
      setSelectedProduct(product);
      setIsEditDialogOpen(true);
    },
    view: (product: Product) => {
      setSelectedProduct(product);
      setIsDetailsOpen(true);
    },
  };

  const transformProduct = (product: Product | null) => {
    if (!product) return null;
    return {
      ...product,
      warehouse: product.warehouse?.name,
    };
  };
  const handleSubmitEdit = async (formData: EditProductFormData) => {
    if (!selectedProduct) return;

    // Transform the warehouse field from string to object format
    const transformedData: Partial<Product> = {
      ...formData,
      warehouse: formData.warehouse ? { name: formData.warehouse } : undefined,
    };

    editMutation.mutate({ ...selectedProduct, ...transformedData });
  };

  if (isLoading || !data) return <InventoryTableSkeleton />;
  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {isDesktop ? (
        <DesktopTable
          data={data?.products}
          onProductAction={handleProductAction}
          pagination={data?.pagination}
          currentPage={page}
          onPageChange={setPage}
        />
      ) : (
        <div className="grid gap-4">
          {data?.products.map((product) => (
            <MobileProductCard
              key={product.id}
              product={product}
              onAction={handleProductAction}
            />
          ))}
        </div>
      )}

      <ProductDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        product={selectedProduct}
      />

      <EditProductDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        product={selectedProduct}
        onSubmit={handleSubmitEdit}
        isLoading={editMutation.status === "pending"}
      />

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        product={transformProduct(selectedProduct)}
        onDelete={() =>
          selectedProduct && deleteMutation.mutate(selectedProduct.id)
        }
        isLoading={deleteMutation.status === "pending"}
      />
    </div>
  );
}
