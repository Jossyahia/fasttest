// app/(dashboard)/inventory/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryTable } from "@/components/inventory/inventory-table";


export default async function InventoryPage() {
   const session = await auth();

   if (!session) {
     redirect("/login");
   }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
      </CardHeader>
      <CardContent>
        <InventoryTable />
      </CardContent>
    </Card>
  );
}
