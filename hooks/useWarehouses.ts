// hooks/useWarehouses.ts
import { useState, useEffect } from "react";

interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch("/api/warehouses");
        if (!response.ok) {
          throw new Error("Failed to fetch warehouses");
        }
        const data = await response.json();
        setWarehouses(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch warehouses"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  return { warehouses, isLoading, error };
}
