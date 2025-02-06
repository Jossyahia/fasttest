import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Enhanced session and organization ID validation
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
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && status !== "ALL" && { status }),
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
