"use client";

import { ProductFilters, SortOption } from "@/types/product";

// Define the InventoryStatus enum locally
export enum InventoryStatus {
  ACTIVE = "ACTIVE",
  SOLD = "SOLD",
  RETURNED = "RETURNED",
}

interface ProductFiltersBarProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function ProductFiltersBar({
  filters,
  onFilterChange,
  sort,
  onSortChange,
}: ProductFiltersBarProps) {
  // Define valid sort fields type based on the error message
  type SortField =
    | "status"
    | "name"
    | "id"
    | "createdAt"
    | "updatedAt"
    | "organizationId"
    | "sku"
    | "description"
    | "quantity"
    | "minStock"
    | "location"
    | "warehouseId";

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="px-4 py-2 border rounded-lg"
        />

        <select
          value={filters.status || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: (e.target.value as InventoryStatus) || undefined,
            })
          }
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          {Object.values(InventoryStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.lowStock || false}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                lowStock: e.target.checked,
              })
            }
            className="mr-2"
          />
          Low Stock Only
        </label>

        <select
          // Wrap sort.field with String(...) to avoid implicit symbol conversion
          value={`${String(sort.field)}-${sort.direction}`}
          onChange={(e) => {
            const [field, direction] = e.target.value.split("-");
            onSortChange({
              field: field as SortField,
              direction: direction as "asc" | "desc",
            });
          }}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="quantity-asc">Quantity Low-High</option>
          <option value="quantity-desc">Quantity High-Low</option>
        </select>
      </div>
    </div>
  );
}
