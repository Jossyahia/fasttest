import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  quantity: z.number().int().min(0, "Quantity must be positive"),
  minStock: z.number().int().min(0).default(10),
  location: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;


