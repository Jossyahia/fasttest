// app/orders/page.tsx
import {redirect} from "next/navigation";
import { Metadata } from "next";
import OrderHeader from "@/components/orders/OrderHeader";
import OrderList from "@/components/orders/OrderList";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Order Management",
  description: "Manage your orders and track their status",
};

export default async function OrdersPage() {
     const session = await auth();

     if (!session) {
       redirect("/login");
     }
  return (
    <div className="space-y-6 p-6">
      <OrderHeader />
      <OrderList />
    </div>
  );
}
