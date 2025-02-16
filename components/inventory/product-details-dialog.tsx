import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "./status-badge";
import { QuantityIndicator } from "./quantity-indicator";
import { Warehouse } from "lucide-react";

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

interface ProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductDetailsDialog({
  open,
  onOpenChange,
  product,
}: ProductDetailsDialogProps) {
  if (!product) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="flex-1 mr-2">{product.name}</span>
            <StatusBadge
              quantity={product.quantity}
              minStock={product.minStock}
            />
          </DialogTitle>
          <DialogDescription>
            Detailed information about this inventory item
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-2">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">SKU</Label>
                <p className="font-medium">{product.sku}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">Location</Label>
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-gray-400" />
                  <span>
                    {product.warehouse?.name || "No warehouse"}
                    {product.location && (
                      <>
                        <span className="text-gray-400 mx-1">/</span>
                        {product.location}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Inventory Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">
                  Current Quantity
                </Label>
                <div className="flex items-center gap-2">
                  <QuantityIndicator
                    quantity={product.quantity}
                    minStock={product.minStock}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">
                  Minimum Stock Level
                </Label>
                <p className="font-medium">{product.minStock} units</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {product.description || "No description available"}
              </p>
            </div>
          </div>

          {/* Timestamps Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">Created At</Label>
                <p className="text-sm text-gray-700">
                  {formatDate(product.createdAt)}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">Last Updated</Label>
                <p className="text-sm text-gray-700">
                  {formatDate(product.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
