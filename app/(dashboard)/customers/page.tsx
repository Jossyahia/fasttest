import { Metadata } from "next";
import CustomerList from "@/components/customers/CustomerList";
import CustomerHeader from "@/components/customers/CustomerHeader";

export const metadata: Metadata = {
  title: "Customer Management",
  description: "Manage your customers and their information",
};

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <CustomerHeader />
      <CustomerList />
    </div>
  );
}
