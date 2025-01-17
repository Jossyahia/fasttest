export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  quantity: number;
  minStock: number;
  location?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  minStock?: number;
  location?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}


export interface UpdateProductInput {
  sku?: string;
  name?: string;
  description?: string | null;
  quantity?: number;
  minStock?: number;
  location?: string | null;
}