import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusProps {
  quantity: number;
  minStock: number;
}

export function StatusBadge({ quantity, minStock }: StatusProps) {
  if (quantity <= 0) {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-600 border-red-200"
      >
        Out of Stock
      </Badge>
    );
  }
  if (quantity <= minStock) {
    return (
      <Badge
        variant="outline"
        className="bg-yellow-50 text-yellow-600 border-yellow-200"
      >
        Low Stock
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-green-50 text-green-600 border-green-200"
    >
      In Stock
    </Badge>
  );
}

export function QuantityIndicator({ quantity, minStock }: StatusProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "text-sm font-medium",
          quantity <= 0 && "text-red-600",
          quantity <= minStock && quantity > 0 && "text-yellow-600",
          quantity > minStock && "text-green-600"
        )}
      >
        {quantity}
      </span>
      {quantity <= minStock && quantity > 0 && (
        <span className="text-xs text-muted-foreground">(Min: {minStock})</span>
      )}
    </div>
  );
}
