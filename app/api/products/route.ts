import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { InventoryStatus, Prisma } from "@prisma/client";
import { z } from "zod";

// Input validation schemas
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  quantity: z.number().min(0).default(0),
  minStock: z.number().min(0).default(0),
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  status: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]).default("IN_STOCK"),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search");
    const status = searchParams.get("status") as InventoryStatus | null;
    const warehouseId = searchParams.get("warehouseId");
    const lowStock = searchParams.get("lowStock") === "true";

    // Validate pagination params
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      organizationId: session.user.organizationId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    // If lowStock is true, only show products where quantity <= minStock
    if (lowStock) {
      where.quantity = {
        lte: prisma.product.fields.minStock,
      };
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where });
    const totalPages = Math.ceil(total / limit);

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error("Products GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Validate input data
    const validationResult = productSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Check if warehouse exists and belongs to organization
    const warehouse = await prisma.warehouse.findFirst({
      where: {
        id: data.warehouseId,
        organizationId: session.user.organizationId,
      },
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: "Invalid warehouse ID" },
        { status: 400 }
      );
    }

    // Check for duplicate SKU within the organization
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku: data.sku,
        organizationId: session.user.organizationId,
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "SKU already exists in your organization" },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        ...validationResult.data,
        organizationId: session.user.organizationId,
      },
      include: {
        warehouse: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "PRODUCT_CREATED",
        details: `Product ${product.name} (${product.sku}) created`,
        userId: session.user.id,
        organizationId: session.user.organizationId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Products POST Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const productId = data.id;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Validate input data
    const validationResult = productSchema.partial().safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Check if product exists and belongs to organization
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        organizationId: session.user.organizationId,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If SKU is being changed, check for duplicates
    if (data.sku && data.sku !== existingProduct.sku) {
      const duplicateSku = await prisma.product.findFirst({
        where: {
          sku: data.sku,
          organizationId: session.user.organizationId,
          id: { not: productId },
        },
      });

      if (duplicateSku) {
        return NextResponse.json(
          { error: "SKU already exists in your organization" },
          { status: 400 }
        );
      }
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: validationResult.data,
      include: {
        warehouse: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "PRODUCT_UPDATED",
        details: `Product ${updatedProduct.name} (${updatedProduct.sku}) updated`,
        userId: session.user.id,
        organizationId: session.user.organizationId,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Products PUT Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists and belongs to organization
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        organizationId: session.user.organizationId,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete product
    await prisma.product.delete({
      where: { id: productId },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "PRODUCT_DELETED",
        details: `Product ${product.name} (${product.sku}) deleted`,
        userId: session.user.id,
        organizationId: session.user.organizationId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Products DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
