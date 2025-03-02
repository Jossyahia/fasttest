import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VendorForm from "@/components/vendors/VendorForm";

export const metadata = {
  title: "Add New Vendor | Inventory Management",
  description: "Create a new vendor record",
};

export default async function NewVendorPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Vendor</h1>
        <p className="mt-2 text-gray-600">
          Create a new vendor for your organization
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <VendorForm />
      </div>
    </div>
  );
}
