import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";
import { QuantityIndicator } from "./quantity-indicator";
import { type Product } from "@/types/inventory";
import { cn } from "@/lib/utils";

interface MobileProductCardProps {
  product: Product;
  onAction: {
    view: (product: Product) => void;
    edit: (product: Product) => void;
    delete: (product: Product) => void;
  };
}

export function MobileProductCard({
  product,
  onAction,
}: MobileProductCardProps) {
  const getCardClassName = (product: Product): string => {
    if (product.quantity <= 0) return "bg-red-50/50 border-red-200";
    if (product.quantity <= product.minStock)
      return "bg-yellow-50/50 border-yellow-200";
    return "";
  };

  return (
    <Card className={cn("transition-colors", getCardClassName(product))}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium leading-none">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.sku}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Open menu"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onClick={() => onAction.view(product)}
                className="group"
              >
                <Eye className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction.edit(product)}
                className="group"
              >
                <Edit className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction.delete(product)}
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
            <p className="text-xs text-muted-foreground">Status</p>
            <StatusBadge
              quantity={product.quantity}
              minStock={product.minStock}
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Quantity</p>
            <QuantityIndicator
              quantity={product.quantity}
              minStock={product.minStock}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <p className="text-xs text-muted-foreground">Location</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              <span className="truncate">
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
      </CardContent>
    </Card>
  );
}
