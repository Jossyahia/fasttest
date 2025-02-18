import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string | null;
  onStatusChange: (value: string | null) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: FilterBarProps) {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Mobile filters */}
      <div className="flex md:hidden">
        <div className="relative flex-1 mr-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
            aria-label="Search products"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setFilterMenuOpen(!filterMenuOpen)}
          aria-expanded={filterMenuOpen}
          aria-label="Toggle filters"
          className="relative"
        >
          <Filter className="h-4 w-4" />
          {status && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </div>

      {filterMenuOpen && (
        <div className="md:hidden border rounded-lg p-4 bg-background">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Status
            </label>
            <Select
              value={status || "all"}
              onValueChange={(value) => {
                onStatusChange(value === "all" ? null : value);
                setFilterMenuOpen(false);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                <SelectItem value="IN_STOCK">In Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Desktop filters */}
      <div className="hidden md:flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            aria-label="Search products"
          />
        </div>
        <Select
          value={status || "all"}
          onValueChange={(value) =>
            onStatusChange(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
            <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
            <SelectItem value="IN_STOCK">In Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
