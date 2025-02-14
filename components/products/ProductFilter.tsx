import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import debounce from "lodash/debounce";

// Define the InventoryStatus enum locally based on your Prisma model
export enum InventoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISCONTINUED = "DISCONTINUED",
}

interface Warehouse {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    status?: InventoryStatus;
    warehouseId?: string;
    lowStock?: boolean;
  }) => void;
}

export default function ProductFilter({ onFilterChange }: ProductFiltersProps) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InventoryStatus | "">("");
  const [warehouseId, setWarehouseId] = useState("");
  const [lowStock, setLowStock] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/warehouses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setWarehouses(data);
        } else {
          setWarehouses([]);
          console.error("Received non-array data:", data);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch warehouses"
        );
        console.error("Failed to fetch warehouses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  const debouncedSearch = debounce((value: string) => {
    onFilterChange({
      search: value,
      status: status || undefined,
      warehouseId: warehouseId || undefined,
      lowStock,
    });
  }, 300);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as InventoryStatus | "";
    setStatus(newStatus);
    onFilterChange({
      search,
      status: newStatus || undefined,
      warehouseId: warehouseId || undefined,
      lowStock,
    });
  };

  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWarehouseId(e.target.value);
    onFilterChange({
      search,
      status: status || undefined,
      warehouseId: e.target.value || undefined,
      lowStock,
    });
  };

  const handleLowStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLowStock(e.target.checked);
    onFilterChange({
      search,
      status: status || undefined,
      warehouseId: warehouseId || undefined,
      lowStock: e.target.checked,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setWarehouseId("");
    setLowStock(false);
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
      {error && (
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
          <h2 className="text-red-800 font-semibold">Something went wrong:</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <select
          value={status}
          onChange={handleStatusChange}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">All Statuses</option>
          {Object.values(InventoryStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={warehouseId}
          onChange={handleWarehouseChange}
          className="rounded-md border border-gray-300 px-3 py-2"
          disabled={isLoading}
        >
          <option value="">All Warehouses</option>
          {!isLoading &&
            !error &&
            warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
        </select>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="lowStock"
            checked={lowStock}
            onChange={handleLowStockChange}
            className="rounded border-gray-300"
          />
          <label htmlFor="lowStock" className="text-sm text-gray-600">
            Low Stock Only
          </label>
        </div>
      </div>

      {(search || status || warehouseId || lowStock) && (
        <button
          onClick={clearFilters}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </button>
      )}
    </div>
  );
}
