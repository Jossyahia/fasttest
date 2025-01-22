// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { InventoryStatus, Prisma } from "@prisma/client";

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

    if (lowStock) {
      where.quantity = {
        lte: Prisma.col("minStock"),
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

    // Validate required fields
    if (!data.sku || !data.name || !data.warehouseId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for duplicate SKU
    const existingProduct = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        organizationId: session.user.organizationId,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "PRODUCT_CREATED",
        details: `Product ${product.name} (${product.sku}) created`,
        userId: session.user.id,
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
