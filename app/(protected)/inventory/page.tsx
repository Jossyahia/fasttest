import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inventory | Dashboard",
  description:
    "Manage your inventory items, stock levels, and product information",
};

export default async function InventoryPage() {
  const session = await auth();

  if (!session) return redirect("/login");

  return (
    <main className="flex flex-col gap-6 py-6 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Inventory
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your products and stock levels efficiently
          </p>
        </div>
        <Link href="/inventory/new">
          <Button className="w-full sm:w-auto" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </header>
      <section className="w-full">
        <InventoryTable />
      </section>
    </main>
  );
}
