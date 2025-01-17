// app/orders/page.tsx
import { Metadata } from "next";
import OrderHeader from "@/components/orders/OrderHeader";
import OrderList from "@/components/orders/OrderList";

export const metadata: Metadata = {
  title: "Order Management",
  description: "Manage your orders and track their status",
};

export default function OrdersPage() {
  return (
    <div className="space-y-6 p-6">
      <OrderHeader />
      <OrderList />
    </div>
  );
}
