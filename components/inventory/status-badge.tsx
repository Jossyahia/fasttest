import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  quantity: number;
  minStock: number;
}

export function StatusBadge({ quantity, minStock }: StatusBadgeProps) {
  const getStatusConfig = (quantity: number, minStock: number) => {
    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-100 text-red-800 border-red-200",
      };
    }
    if (quantity <= minStock) {
      return {
        label: "Low Stock",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    }
    return {
      label: "In Stock",
      className: "bg-green-100 text-green-800 border-green-200",
    };
  };

  const status = getStatusConfig(quantity, minStock);

  return (
    <Badge variant="outline" className={cn(status.className, "font-medium")}>
      {status.label}
    </Badge>
  );
}
