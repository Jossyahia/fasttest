import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import VendorForm from "@/components/vendors/VendorForm";

export const metadata = {
  title: "Edit Vendor | Inventory Management",
  description: "Update vendor information",
};

async function getVendor(id: string, organizationId: string) {
  const prisma = new PrismaClient();
  try {
    return await prisma.vendor.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  } catch (error) {
    console.error("Failed to fetch vendor:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

interface PageProps {
  // Note: In Next.js 14 dynamic parameters are provided asynchronously.
  params: Promise<Record<string, string>>;
}

export default async function EditVendorPage(props: PageProps) {
  // Await the params before accessing their properties.
  const paramsObject = await props.params;
  const vendorId = paramsObject.id;

  const session = await auth();
  if (!session) return redirect("/login");
  if (!session.user?.organizationId) return redirect("/onboarding");
  if (!vendorId) return notFound();

  const vendor = await getVendor(vendorId, session.user.organizationId);
  if (!vendor) return notFound();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Vendor</h1>
        <p className="mt-2 text-gray-600">Update vendor information</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <VendorForm initialData={vendor} />
      </div>
    </div>
  );
}
