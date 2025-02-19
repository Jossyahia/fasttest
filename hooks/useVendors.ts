// hooks/useVendors.ts
import { useState, useEffect } from "react";

interface Vendor {
  id: string;
  name: string;
  location: string;
}

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("/api/vendors");
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch vendors"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return { vendors, isLoading, error };
}
