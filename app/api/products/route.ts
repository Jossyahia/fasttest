import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type {
  ProductFormData,
  ProductsResponse,
  InventoryStatus,
  Product,
} from "@/types/product";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as ProductFormData;

    // Validate required fields
    if (!body.sku?.trim()) {
      return NextResponse.json({ error: "SKU is required" }, { status: 400 });
    }
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!body.warehouseId) {
      return NextResponse.json(
        { error: "Warehouse is required" },
        { status: 400 }
      );
    }

    // Validate warehouse exists and belongs to organization
    const warehouse = await prisma.warehouse.findFirst({
      where: {
        id: body.warehouseId,
        organizationId: session.user.organizationId,
      },
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: "Invalid warehouse selected" },
        { status: 400 }
      );
    }

    // Check for duplicate SKU
    const existingSku = await prisma.product.findFirst({
      where: {
        sku: body.sku.trim(),
        organizationId: session.user.organizationId,
      },
    });

    if (existingSku) {
      return NextResponse.json(
        { error: "SKU already exists in your organization" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sku: body.sku.trim(),
        name: body.name.trim(),
        description: body.description?.trim() || "",
        organizationId: session.user.organizationId,
        warehouseId: body.warehouseId,
        quantity: Number(body.quantity) || 0,
        minStock: Number(body.minStock) || 1,
        status: body.status || "ACTIVE",
        location: body.location?.trim() || "",
      },
      include: {
        warehouse: {
          select: {
            name: true,
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
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 6);
    const search = searchParams.get("search") || undefined;

    // Add sorting parameters
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";

    const statusParam = searchParams.get("status") as InventoryStatus | null;
    const status = statusParam || undefined;
    const warehouseId = searchParams.get("warehouseId") || undefined;
    const lowStock = searchParams.get("lowStock") === "true";

    // Build the where condition properly
    const whereCondition: Prisma.ProductWhereInput = {
      organizationId: session.user.organizationId,
    };

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { sku: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ];
    }

    if (status) {
      whereCondition.status = status;
    }

    if (warehouseId) {
      whereCondition.warehouseId = warehouseId;
    }

    if (lowStock) {
      whereCondition.quantity = {
        lte: 10,
      };
    }

    // Create dynamic orderBy object
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortField]: sortOrder,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          warehouse: {
            select: {
              name: true,
            },
          },
        },
        orderBy,
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    // Transform products to match the expected interface
    const transformedProducts: Product[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      description: p.description,
      quantity: p.quantity,
      minStock: p.minStock,
      status: p.status,
      location: p.location,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      organizationId: p.organizationId,
      warehouseId: p.warehouseId,
    }));

    const response: ProductsResponse = {
      products: transformedProducts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
