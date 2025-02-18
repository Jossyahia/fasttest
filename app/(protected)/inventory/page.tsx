import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inventory Management | Dashboard",
  description:
    "Track and manage your inventory items, stock levels, and product information efficiently",
};

export default async function InventoryPage() {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  return (
    <main
      className="flex min-h-[calc(100vh-4rem)] flex-col gap-6 p-4 md:p-6 lg:p-8"
      role="main"
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Inventory Management
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Manage your products and stock levels efficiently
            </p>
          </div>
          <Link
            href="/inventory"
            className="shrink-0"
            aria-label="Add new product"
          >
            <Button className="w-full md:w-auto group" size="default">
              <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Add Product
            </Button>
          </Link>
        </header>

        <section className="mt-6 w-full" aria-label="Inventory list">
          <InventoryTable />
        </section>
      </div>
    </main>
  );
}
