// app/vendors/[id]/page.tsx
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import VendorDetailClient from "./vendor-detail-client";

export const metadata = {
  title: "Vendor Details | Inventory Management",
  description: "View vendor information and products",
};

async function getVendor(id: string, organizationId: string) {
  const prisma = new PrismaClient();
  try {
    return await prisma.vendor.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        products: {
          select: {
            id: true,
            sku: true,
            name: true,
            quantity: true,
            status: true,
            minStock: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch vendor:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

interface VendorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function VendorDetailPage({
  params,
}: VendorDetailPageProps) {
  const { id } = await params; // Await params to extract id

  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const vendor = await getVendor(id, session.user.organizationId);
  if (!vendor) {
    notFound();
  }

  return <VendorDetailClient vendor={vendor} />;
}
