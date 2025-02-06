import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CustomerList from "@/components/customers/CustomerList";
import CustomerHeader from "@/components/customers/CustomerHeader";

export const metadata: Metadata = {
  title: "Customer Management",
  description: "Manage your customers and their information",
};

export default async function CustomersPage() {

     const session = await auth();

     if (!session) {
       redirect("/login");
     }
  return (
    <div className="space-y-6">
      <CustomerHeader />
      <CustomerList />
    </div>
  );
}
