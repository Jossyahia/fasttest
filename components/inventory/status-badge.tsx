// // components/inventory/status-badge.tsx
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";

// interface StatusBadgeProps {
//   quantity: number;
//   minStock: number;
// }

// export function StatusBadge({ quantity, minStock }: StatusBadgeProps) {
//   const getStatusConfig = (quantity: number, minStock: number) => {
//     if (quantity <= 0) {
//       return {
//         label: "Out of Stock",
//         className:
//           "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-800",
//       };
//     }
//     if (quantity <= minStock) {
//       return {
//         label: "Low Stock",
//         className:
//           "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800",
//       };
//     }
//     return {
//       label: "In Stock",
//       className:
//         "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800",
//     };
//   };

//   const status = getStatusConfig(quantity, minStock);

//   return (
//     <Badge
//       variant="outline"
//       className={cn("text-xs font-medium px-3 py-1", status.className)}
//     >
//       {status.label}
//     </Badge>
//   );
// }


// status-badge.tsx
import { cn } from "@/lib/utils";
interface StatusBadgeProps {
  quantity: number;
  minStock: number;
}

export function StatusBadge({ quantity, minStock }: StatusBadgeProps) {
  const getStatusInfo = () => {
    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-100 text-red-800",
      };
    }
    if (quantity <= minStock) {
      return {
        label: "Low Stock",
        className: "bg-yellow-100 text-yellow-800",
      };
    }
    return {
      label: "In Stock",
      className: "bg-green-100 text-green-800",
    };
  };

  const { label, className } = getStatusInfo();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}

