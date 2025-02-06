import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { updateProductSchema } from "@/lib/validations/product";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const json = await req.json();
    const validatedData = updateProductSchema.parse(json);

    if (validatedData.sku) {
      const existingProduct = await prisma.product.findUnique({
        where: { sku: validatedData.sku },
      });

      if (existingProduct && existingProduct.id !== id) {
        return NextResponse.json(
          { error: "Product with this SKU already exists" },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: id },
    });

    if (orderItems) {
      return NextResponse.json(
        { error: "Cannot delete product with associated orders" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
