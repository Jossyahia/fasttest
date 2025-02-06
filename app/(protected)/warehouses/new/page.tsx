// app/warehouses/new/page.tsx
import WarehouseForm from "@/components/warehouses/warehouse-form";

export default function NewWarehousePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">New Warehouse</h1>
      <WarehouseForm />
    </div>
  );
}
