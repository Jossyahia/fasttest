// // components/inventory/quantity-indicator.tsx
// import { cn } from "@/lib/utils";

// interface QuantityIndicatorProps {
//   quantity: number;
//   minStock: number;
// }

// export function QuantityIndicator({
//   quantity,
//   minStock,
// }: QuantityIndicatorProps) {
//   const getQuantityColor = (quantity: number, minStock: number) => {
//     if (quantity <= 0) return "text-red-600";
//     if (quantity <= minStock) return "text-yellow-600";
//     return "text-green-600";
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <span className={cn("font-medium", getQuantityColor(quantity, minStock))}>
//         {quantity}
//       </span>
//       <span className="text-xs text-gray-500">(Min: {minStock})</span>
//     </div>
//   );
// }


// quantity-indicator.tsx
interface QuantityIndicatorProps {
  quantity: number;
  minStock: number;
}

export function QuantityIndicator({
  quantity,
  minStock,
}: QuantityIndicatorProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium">{quantity}</span>
      {quantity <= minStock && (
        <span className="text-xs text-yellow-600">(Min: {minStock})</span>
      )}
    </div>
  );
}
