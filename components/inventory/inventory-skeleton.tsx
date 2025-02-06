// components/inventory/inventory-skeleton.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function InventoryTableSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-4">
            {/* Search and Filter Skeleton */}
            <div className="flex gap-4 w-full">
              <div className="h-10 bg-gray-200 rounded-md w-full max-w-md animate-pulse" />
              <div className="h-10 bg-gray-200 rounded-md w-[180px] animate-pulse" />
            </div>
          </div>
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
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-300 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
