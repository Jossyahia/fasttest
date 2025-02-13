// types/warehouse.ts
export interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

// types/form.ts
export interface WarehouseFormData {
  name: string;
  location: string;
}
