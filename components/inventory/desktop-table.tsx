import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";
import { QuantityIndicator } from "./quantity-indicator";
import { type Product, type PaginationData } from "@/types/inventory";
import { cn } from "@/lib/utils";

interface DesktopTableProps {
  data: Product[];
  pagination: PaginationData;
  currentPage: number;
  onPageChange: (page: number) => void;
  onProductAction: {
    view: (product: Product) => void;
    edit: (product: Product) => void;
    delete: (product: Product) => void;
  };
}

export function DesktopTable({
  data,
  pagination,
  currentPage,
  onPageChange,
  onProductAction,
}: DesktopTableProps) {
  const getRowClassName = (product: Product): string => {
    if (product.quantity <= 0) return "bg-red-50/50";
    if (product.quantity <= product.minStock) return "bg-yellow-50/50";
    return "";
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[140px]">Quantity</TableHead>
                <TableHead className="min-w-[200px]">Location</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((product) => (
                  <TableRow
                    key={product.id}
                    className={cn(
                      "transition-colors",
                      getRowClassName(product)
                    )}
                  >
                    <TableCell className="font-medium">{product.sku}</TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      {product.name}
                    </TableCell>
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
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            aria-label={`Actions for ${product.name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={() => onProductAction.view(product)}
                            className="group"
                          >
                            <Eye className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onProductAction.edit(product)}
                            className="group"
                          >
                            <Edit className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onProductAction.delete(product)}
                            className="group text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, pagination.totalItems)} of{" "}
              {pagination.totalItems} items
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPageChange(Math.min(pagination.totalPages, currentPage + 1))
                }
                disabled={currentPage === pagination.totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
