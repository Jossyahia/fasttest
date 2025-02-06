// hooks/use-fetch-inventory.ts
import { useState, useEffect } from "react";
import { InventoryResponse } from "@/types/inventory";

interface FetchInventoryParams {
  page?: number;
  search?: string;
  status?: string;
}

export function useFetchInventory({
  page = 1,
  search = "",
  status,
}: FetchInventoryParams) {
  const [data, setData] = useState<InventoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchInventory() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          search,
        });

        // Only add status if it's not null or undefined
        if (status && status !== "ALL") {
          params.append("status", status);
        }

        const response = await fetch(`/api/inventory?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch inventory");
        }

        const inventoryData = await response.json();
        setData(inventoryData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchInventory();
  }, [page, search, status]);

  return { data, isLoading, error };
}
