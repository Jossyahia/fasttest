// app/(dashboard)/warehouses/page.tsx
import { Suspense } from "react";
import WarehouseList from "@/components/warehouses/warehouse-list";
import WarehouseListSkeleton from "@/components/warehouses/warehouse-list-skeleton";
import CreateWarehouse from "@/components/warehouses/create-warehouse";
import { Providers } from "./../../providers";

export default async function WarehousesPage() {
  return (
    <Providers>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Warehouses</h1>
          <CreateWarehouse />
        </div>

        <Suspense fallback={<WarehouseListSkeleton />}>
          <WarehouseList />
        </Suspense>
      </div>
    </Providers>
  );
}
