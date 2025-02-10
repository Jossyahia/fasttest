"use client";
import { useState, useCallback } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductFilter from "@/components/products/ProductFilter";
import ProductTable from "@/components/products/ProductTable";
import CreateProduct from "@/components/products/CreateProduct";
import EditProduct from "@/components/products/EditProduct";
import { Plus } from "lucide-react";
import { Prisma } from "@prisma/client"; // ✅ Corrected Import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductFilters {
  search?: string;
  status?: Prisma.InventoryStatus; // ✅ Corrected Reference
  warehouseId?: string;
  lowStock?: boolean;
  page?: number;
}

export default function ProductsClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    status: Prisma.InventoryStatus.ACTIVE, // ✅ Proper usage
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { products, isLoading, error, pagination, mutate } = useProducts({
    ...filters,
    page: currentPage,
  });

  const handleFilterChange = useCallback((newFilters: ProductFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this product?")) {
        return;
      }
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to delete product");
        }
        mutate();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    },
    [mutate]
  );

  const handleProductCreated = useCallback(() => {
    setIsCreateModalOpen(false);
    mutate();
  }, [mutate]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      <ProductFilter onFilterChange={handleFilterChange} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
          <p className="font-medium">Error loading products</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <ProductTable
        products={products || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={pagination?.pages || 1}
        onPageChange={handlePageChange}
      />

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          <CreateProduct
            onSuccess={handleProductCreated}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingProduct !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setEditingProduct(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <EditProduct
              product={editingProduct}
              onSuccess={() => {
                setEditingProduct(null);
                mutate();
              }}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
