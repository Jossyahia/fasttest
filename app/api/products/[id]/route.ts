// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // Check if product exists and belongs to user's organization
    const product = await prisma.product.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the product
    await prisma.product.delete({
      where: { id },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "PRODUCT_DELETED",
        details: `Product ${product.name} (${product.sku}) deleted`,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const data = await req.json();

    // Check if product exists and belongs to user's organization
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check for duplicate SKU if SKU is being changed
    if (data.sku && data.sku !== existingProduct.sku) {
      const duplicateSku = await prisma.product.findFirst({
        where: {
          sku: data.sku,
          id: { not: id },
          organizationId: session.user.organizationId,
        },
      });

      if (duplicateSku) {
        return NextResponse.json(
          { error: "SKU already exists" },
          { status: 400 }
        );
      }
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        quantity: data.quantity ? parseInt(data.quantity) : undefined,
        minStock: data.minStock ? parseInt(data.minStock) : undefined,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "PRODUCT_UPDATED",
        details: `Product ${updatedProduct.name} (${updatedProduct.sku}) updated`,
        userId: session.user.id,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}