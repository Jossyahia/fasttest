"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Icons
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

// Utilities
function cn(...inputs: (string | undefined)[]) {
  return twMerge(clsx(inputs));
}

// Schema
const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  minStock: z.number().min(0, "Minimum stock must be 0 or greater"),
  location: z.string().optional(),
});

// Add EditProductDialog component
const EditProductDialog = ({
  open,
  onOpenChange,
  product,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) => {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: product?.sku || "",
      name: product?.name || "",
      description: product?.description || "",
      quantity: product?.quantity || 0,
      minStock: product?.minStock || 0,
      location: product?.location || "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        sku: product.sku,
        name: product.name,
        description: product.description || "",
        quantity: product.quantity,
        minStock: product.minStock,
        location: product.location || "",
      });
    }
  }, [product, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product information below
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
// Components
const StatusBadge = ({
  quantity,
  minStock,
}: {
  quantity: number;
  minStock: number;
}) => {
  const getStatusConfig = (quantity: number, minStock: number) => {
    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        className:
          "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-800",
      };
    }
    if (quantity <= minStock) {
      return {
        label: "Low Stock",
        className:
          "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800",
      };
    }
    return {
      label: "In Stock",
      className:
        "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800",
    };
  };

  const status = getStatusConfig(quantity, minStock);

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium px-3 py-1", status.className)}
    >
      {status.label}
    </Badge>
  );
};

const QuantityIndicator = ({
  quantity,
  minStock,
}: {
  quantity: number;
  minStock: number;
}) => {
  const getQuantityColor = (quantity: number, minStock: number) => {
    if (quantity <= 0) return "text-red-600";
    if (quantity <= minStock) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="flex items-center gap-2">
      <span className={cn("font-medium", getQuantityColor(quantity, minStock))}>
        {quantity}
      </span>
      <span className="text-xs text-gray-500">(Min: {minStock})</span>
    </div>
  );
};

const InventoryList = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/inventory");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.products ?? [];
    },
    initialData: [],
  });

  // Delete mutation
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

  // Edit mutation
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

  const handleSubmitEdit = async (formData: Product) => {
    if (selectedProduct) {
      const updatedProduct = {
        ...selectedProduct,
        ...formData,
      };
      editMutation.mutate(updatedProduct);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <div className="text-sm text-gray-600">Loading inventory...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-10">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <div className="text-sm">Error loading inventory</div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((product: Product) => (
                <TableRow
                  key={product.id}
                  className={cn(
                    "transition-colors",
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
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                      {product.location || "No location"}
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

      {/* Product Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected product
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">SKU</h4>
                  <p>{selectedProduct.sku}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p>{selectedProduct.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Quantity
                  </h4>
                  <QuantityIndicator
                    quantity={selectedProduct.quantity}
                    minStock={selectedProduct.minStock}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="mt-1">
                    <StatusBadge
                      quantity={selectedProduct.quantity}
                      minStock={selectedProduct.minStock}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Location
                  </h4>
                  <p>{selectedProduct.location || "-"}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">
                    Description
                  </h4>
                  <p className="text-gray-700">
                    {selectedProduct.description || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-500">
                    Created At
                  </h4>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedProduct.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-500">
                    Last Updated
                  </h4>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedProduct.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product "{selectedProduct?.name}" from the inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedProduct && deleteMutation.mutate(selectedProduct.id)
              }
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default InventoryList;
