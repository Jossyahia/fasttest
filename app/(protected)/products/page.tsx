// app/(protected)/products/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";
import { ProductTableSkeleton } from "@/components/products/ProductTableSkeleton";

export default async function ProductsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Suspense fallback={<ProductTableSkeleton />}>
        <ProductsClient />
      </Suspense>
    </div>
  );
}
