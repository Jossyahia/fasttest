// components/inventory/product-details-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "./status-badge";
import { QuantityIndicator } from "./quantity-indicator";

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{product.name}</span>
            <StatusBadge
              quantity={product.quantity}
              minStock={product.minStock}
            />
          </DialogTitle>
          <DialogDescription>
            Detailed information about this inventory item
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">SKU</Label>
                <p className="font-medium">{product.sku}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">Location</Label>
                <p className="font-medium">
                  {product.location || "No location set"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Inventory Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                {product.description || "No description available"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">History</h3>
            <div className="grid grid-cols-2 gap-4">
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
