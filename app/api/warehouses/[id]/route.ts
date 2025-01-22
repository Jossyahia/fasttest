// // app/api/warehouses/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { prisma } from "@/lib/prisma";
// import { authOptions } from "@/lib/auth";

// export async function GET(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const warehouses = await prisma.warehouse.findMany({
//       where: {
//         organizationId: session.user.organizationId,
//       },
//       select: {
//         id: true,
//         name: true,
//         location: true,
//       },
//       orderBy: {
//         name: "asc",
//       },
//     });

//     return NextResponse.json(warehouses);
//   } catch (error) {
//     console.error("Warehouses GET Error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const data = await req.json();

//     // Validate required fields
//     if (!data.name) {
//       return NextResponse.json({ error: "Name is required" }, { status: 400 });
//     }

//     const warehouse = await prisma.warehouse.create({
//       data: {
//         ...data,
//         organizationId: session.user.organizationId,
//       },
//     });

//     // Log activity
//     await prisma.activity.create({
//       data: {
//         action: "WAREHOUSE_CREATED",
//         details: `Warehouse ${warehouse.name} created`,
//         userId: session.user.id,
//       },
//     });

//     return NextResponse.json(warehouse, { status: 201 });
//   } catch (error) {
//     console.error("Warehouses POST Error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// app/api/warehouses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const warehouse = await prisma.warehouse.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId,
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
            quantity: true,
            status: true,
          },
        },
      },
    });

    if (!warehouse) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    }

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error("Warehouse GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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

    const data = await req.json();

    // Verify warehouse exists and belongs to organization
    const existingWarehouse = await prisma.warehouse.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId,
      },
    });

    if (!existingWarehouse) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    }

    const warehouse = await prisma.warehouse.update({
      where: { id: params.id },
      data,
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "WAREHOUSE_UPDATED",
        details: `Warehouse ${warehouse.name} updated`,
        userId: session.user.id,
      },
    });

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error("Warehouse PATCH Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify warehouse exists and belongs to organization
    const warehouse = await prisma.warehouse.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId,
      },
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!warehouse) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    }

    // Check if warehouse has products
    if (warehouse.products.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete warehouse with existing products" },
        { status: 400 }
      );
    }

    await prisma.warehouse.delete({
      where: { id: params.id },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "WAREHOUSE_DELETED",
        details: `Warehouse ${warehouse.name} deleted`,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ status: "deleted" });
  } catch (error) {
    console.error("Warehouse DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


