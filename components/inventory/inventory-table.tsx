// inventory-table.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertCircle, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { ProductDetailsDialog } from "./product-details-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { DeleteProductDialog } from "./delete-product-dialog";
import { StatusBadge } from "./status-badge";
import { QuantityIndicator } from "./quantity-indicator";
import { cn } from "@/lib/utils";
import { InventoryTableSkeleton } from "./inventory-skeleton";

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  quantity: number;
  minStock: number;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  warehouse?: { name: string };
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

type EditProductFormData = {
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  minStock: number;
  location?: string;
  warehouse?: string;
};

interface DeleteProduct extends Omit<Product, "warehouse"> {
  warehouse?: string | null;
}

export function InventoryTable() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [page] = useState(1);
  const [limit] = useState(10);
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["products", search, status, page, limit],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) searchParams.append("search", search);
      if (status && status !== "all") searchParams.append("status", status);
      const response = await fetch(`/api/inventory?${searchParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch inventory");
      }
      const data = await response.json();
      return data as { products: Product[]; pagination: PaginationData };
    },
  });

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

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleSubmitEdit = async (formData: EditProductFormData) => {
    if (!selectedProduct) return;

    const warehouseObj = formData.warehouse
      ? { name: formData.warehouse }
      : selectedProduct.warehouse;

    const updatedProduct: Product = {
      ...selectedProduct,
      ...formData,
      warehouse: warehouseObj,
    };
    editMutation.mutate(updatedProduct);
  };

  const getRowClassName = (product: Product): string => {
    if (product.quantity <= 0) return "bg-red-50/50";
    if (product.quantity <= product.minStock) return "bg-yellow-50/50";
    return "";
  };

  if (isLoading) {
    return <InventoryTableSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-10">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <div className="text-sm">
              {error instanceof Error
                ? error.message
                : "Error loading inventory"}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const productForDeletion: DeleteProduct | null = selectedProduct
    ? {
        ...selectedProduct,
        warehouse: selectedProduct.warehouse
          ? selectedProduct.warehouse.name
          : null,
      }
    : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>
            Manage your products and stock levels efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between space-x-4 mb-4">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md"
            />
            <Select
              value={status || "all"}
              onValueChange={(value) =>
                setStatus(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                <SelectItem value="IN_STOCK">In Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>(Warehouse) Location</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.products.map((product) => (
                <TableRow
                  key={product.id}
                  className={cn("transition-colors", getRowClassName(product))}
                >
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <StatusBadge
                      quantity={product.quantity}
                      minStock={product.minStock}
                    />
                  </TableCell>
                  <TableCell>
                    <QuantityIndicator
                      quantity={product.quantity}
                      minStock={product.minStock}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                      {product.warehouse?.name || "No warehouse"}
                      {product.location && (
                        <>
                          <span className="text-gray-400">/</span>
                          {product.location}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(product)}
                          className="text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(product)}
                          className="text-green-600 focus:text-green-600 focus:bg-green-50"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(product)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
        product={productForDeletion}
        onDelete={() =>
          selectedProduct && deleteMutation.mutate(selectedProduct.id)
        }
        isLoading={deleteMutation.status === "pending"}
      />
    </div>
  );
}
