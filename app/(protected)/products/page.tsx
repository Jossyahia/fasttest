import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProductList from "@/components/products/ProductList";
import Loading from "@/components/ui/Loading";

export default async function ProductsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <ProductList />
      </Suspense>
    </div>
  );
}
