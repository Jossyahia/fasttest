// app/(protected)/warehouses/[id]/page.tsx
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WarehouseDetails } from "./warehouse-details";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WarehousePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session) return null;

  const warehouse = await prisma.warehouse.findUnique({
    where: {
      id,
      organizationId: session.user.organizationId,
    },
    include: {
      products: true,
    },
  });

  if (!warehouse) {
    notFound();
  }

  return <WarehouseDetails warehouse={warehouse} />;
}
