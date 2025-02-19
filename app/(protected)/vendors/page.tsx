import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VendorList from "@/components/vendors/VendorList";

export const metadata = {
  title: "Vendors | Inventory Management",
  description: "Manage your suppliers and vendors",
};

interface VendorFromDB {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  location: string | null;
  _count: {
    products: number;
  };
}

export interface Vendor {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  location: string | null;
  products: null[];
}

async function getVendors(organizationId: string): Promise<VendorFromDB[]> {
  const prisma = new PrismaClient();
  try {
    return await prisma.vendor.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch vendors:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export default async function VendorsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const vendorsFromDB = await getVendors(session.user.organizationId);

  const transformedVendors: Vendor[] = vendorsFromDB.map((vendor) => ({
    id: vendor.id,
    name: vendor.name,
    createdAt: vendor.createdAt,
    updatedAt: vendor.updatedAt,
    organizationId: vendor.organizationId,
    location: vendor.location,
    products: Array(vendor._count.products).fill(null),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <VendorList initialVendors={transformedVendors} />
    </div>
  );
}
