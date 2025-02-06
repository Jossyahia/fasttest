import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await request.json();
    const { name, location } = body;

    // Ensure the warehouse belongs to the same organization
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
    });
    if (
      !warehouse ||
      warehouse.organizationId !== session.user.organizationId
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedWarehouse = await prisma.warehouse.update({
      where: { id },
      data: { name, location },
    });

    return NextResponse.json(updatedWarehouse);
  } catch (error) {
    console.error("Error updating warehouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    // Ensure the warehouse belongs to the same organization
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
    });
    if (
      !warehouse ||
      warehouse.organizationId !== session.user.organizationId
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.warehouse.delete({ where: { id } });

    return NextResponse.json({ message: "Warehouse deleted" });
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
