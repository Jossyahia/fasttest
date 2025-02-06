// app/api/customers/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Note: The context parameter’s type indicates that `params` is a Promise.
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await dynamic route parameters.
  const { id } = await params;
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;

  try {
    const body = await request.json();
    const { name, email, phone, type, address } = body;

    // Update the customer only if it belongs to the authenticated organization.
    const result = await prisma.customer.updateMany({
      where: { id, organizationId },
      data: { name, email, phone, type, address },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await dynamic route parameters.
  const { id } = await params;
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;

  try {
    // Delete the customer only if it belongs to the authenticated organization.
    const result = await prisma.customer.deleteMany({
      where: { id, organizationId },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
