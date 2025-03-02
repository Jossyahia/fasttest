// app/warehouses/page.tsx
import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import WarehouseList from "@/components/warehouses/warehouse-list";
import { CreateWarehouseButton } from "./create-warehouse-button";

export default async function WarehousesPage() {
  const session = await auth();
  if (!session) return null;

  const warehouses = await prisma.warehouse.findMany({
    where: {
      organizationId: session.user.organizationId,
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Warehouses</h1>
        <CreateWarehouseButton />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <WarehouseList initialData={warehouses} />
      </Suspense>
    </div>
  );
}
