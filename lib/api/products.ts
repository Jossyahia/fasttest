import { Product, ProductFilters, ProductsResponse } from "@/types/product";

export async function getProducts(
  filters: ProductFilters,
  sort: { field: string; direction: "asc" | "desc" },
  page: number = 1
): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    sortField: sort.field,
    sortOrder: sort.direction,
  });

  // Add filters to URL parameters
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.lowStock) params.set("lowStock", "true");

  const response = await fetch(`/api/products?${params}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Failed to fetch products: ${response.status}`
    );
  }

  return response.json();
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create product");
  }

  return response.json();
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update product");
  }

  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete product");
  }
}
