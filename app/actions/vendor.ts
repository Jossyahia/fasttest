// app/actions/warehouse.ts(for vendor)
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createWarehouse(data: {
  name: string;
  location: string;
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const warehouse = await prisma.warehouse.create({
    data: {
      ...data,
      organizationId: session.user.organizationId,
    },
  });

  revalidatePath("/warehouses");
  return warehouse;
}

export async function updateWarehouse(
  id: string,
  data: {
    name: string;
    location: string;
  }
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const warehouse = await prisma.warehouse.update({
    where: {
      id,
      organizationId: session.user.organizationId,
    },
    data,
  });

  revalidatePath("/warehouses");
  revalidatePath(`/warehouses/${id}`);
  return warehouse;
}

export async function deleteWarehouse(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.warehouse.delete({
    where: {
      id,
      organizationId: session.user.organizationId,
    },
  });

  revalidatePath("/warehouses");
}
