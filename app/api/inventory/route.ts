import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Define the enum based on your Prisma schema values
enum InventoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISCONTINUED = "DISCONTINUED",
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: "Unauthorized or missing organization" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const whereCondition = {
      organizationId: session.user.organizationId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { sku: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(status && status !== "ALL" && { status: status as InventoryStatus }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        include: {
          warehouse: {
            select: { name: true },
          },
        },
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error("Inventory fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch inventory",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
