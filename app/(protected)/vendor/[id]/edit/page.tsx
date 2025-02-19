///(For vendor)
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WarehouseForm } from "./warehouse-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWarehousePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const session = await auth();
  if (!session) return null;

  if (!id) notFound();

  const warehouse = await prisma.warehouse.findUnique({
    where: {
      id,
      organizationId: session.user.organizationId,
    },
    include: {
      products: true,
    },
  });

  if (!warehouse) notFound();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Warehouse</h1>
      <WarehouseForm warehouse={warehouse} />
    </div>
  );
}
