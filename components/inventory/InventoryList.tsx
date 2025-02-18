"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Icons
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  Plus,
  Search,
  Filter,
} from "lucide-react";

// UI Components
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
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Custom Components
import { StatusBadge } from "@/components/inventory/status-badge";
import { QuantityIndicator } from "@/components/inventory/quantity-indicator";
import { LocationBadge } from "@/components/inventory/location-badge";
import { ProductDetailsDialog } from "@/components/inventory/product-details-dialog";
import { EditProductDialog } from "@/components/inventory/edit-product-dialog";

// Schema
const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  minStock: z.number().min(0, "Minimum stock must be 0 or greater"),
  location: z.string().optional(),
});

// Types
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
}

type ProductFormData = z.infer<typeof productSchema>;

const InventoryList = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/inventory");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return data.products ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/inventory/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete product");
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
        const error = await response.json();
        throw new Error(error.message || "Failed to update product");
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

  const filteredProducts = React.useMemo(() => {
    if (!data) return [];

    return data.filter((product: Product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesFilter = true;
      if (filterStatus === "low") {
        matchesFilter =
          product.quantity <= product.minStock && product.quantity > 0;
      } else if (filterStatus === "out") {
        matchesFilter = product.quantity <= 0;
      }

      return matchesSearch && matchesFilter;
    });
  }, [data, searchQuery, filterStatus]);

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

  const handleSubmitEdit = (formData: ProductFormData) => {
    try {
      const validatedData = productSchema.parse(formData);
      if (selectedProduct) {
        const updatedProduct = {
          ...selectedProduct,
          ...validatedData,
        };
        editMutation.mutate(updatedProduct);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading inventory...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">Error loading inventory</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0 sm:p-6">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="w-[100px]">Location</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: Product) => (
                  <TableRow
                    key={product.id}
                    className={cn(
                      "transition-colors hover:bg-muted/50",
                      product.quantity <= 0 && "bg-red-50/50",
                      product.quantity <= product.minStock &&
                        product.quantity > 0 &&
                        "bg-yellow-50/50"
                    )}
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
                      <LocationBadge location={product.location} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-background/80"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(product)}
                            className="group"
                          >
                            <Eye className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(product)}
                            className="group"
                          >
                            <Edit className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product)}
                            className="group text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 p-4 md:hidden">
            {filteredProducts.map((product: Product) => (
              <Card
                key={product.id}
                className={cn(
                  "transition-colors",
                  product.quantity <= 0 && "bg-red-50/50 border-red-200",
                  product.quantity <= product.minStock &&
                    product.quantity > 0 &&
                    "bg-yellow-50/50 border-yellow-200"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium leading-none">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.sku}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-background/80"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(product)}
                          className="group"
                        >
                          <Eye className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(product)}
                          className="group"
                        >
                          <Edit className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(product)}
                          className="group text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Status
                      </Label>
                      <StatusBadge
                        quantity={product.quantity}
                        minStock={product.minStock}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Quantity
                      </Label>
                      <QuantityIndicator
                        quantity={product.quantity}
                        minStock={product.minStock}
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Location
                      </Label>
                      <LocationBadge location={product.location} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        product={selectedProduct}
      />

      {/* Edit Product Dialog */}
      <EditProductDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        product={selectedProduct}
        onSubmit={handleSubmitEdit}
        isLoading={editMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedProduct?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="sm:mr-3"
              disabled={deleteMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedProduct && deleteMutation.mutate(selectedProduct.id)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </div>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No products found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              {searchQuery
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Get started by adding your first product to the inventory."}
            </p>
            {!searchQuery && (
              <Button className="group">
                <Plus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Add Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mobile Pagination (if needed) */}
      <div className="md:hidden">
        <Card className="mt-4">
          <CardContent className="flex items-center justify-between p-4">
            <Button
              variant="outline"
              size="sm"
              className="w-[120px]"
              disabled={true} // Add logic here
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page 1 of 1 {/* Add logic here */}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-[120px]"
              disabled={true} // Add logic here
            >
              Next
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryList;
