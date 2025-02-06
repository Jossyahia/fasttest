// // app/(dashboard)/warehouses/page.tsx
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import { Suspense } from "react";
// import WarehouseList from "@/components/warehouses/warehouse-list";
// import WarehouseListSkeleton from "@/components/warehouses/warehouse-list-skeleton";
// import CreateWarehouse from "@/components/warehouses/create-warehouse";

// import { Providers } from "./../../providers";

// export default async function WarehousesPage() {
//   const session = await auth();
//   if (!session) {
//     redirect("/login");
//   }
//   return (
//     <Providers>
//       <div className="container mx-auto p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Warehouses</h1>
//           <CreateWarehouse />
//         </div>

//         <Suspense fallback={<WarehouseListSkeleton />}>
//           <WarehouseList />
//         </Suspense>
//       </div>
//     </Providers>
//   );
// }

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
