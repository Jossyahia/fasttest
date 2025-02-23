// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    // Use organizationId from session.user
    const organizationId = session.user?.organizationId;
    if (!organizationId) {
      return new NextResponse("Missing organization ID", { status: 400 });
    }

    const body = await req.json();
    const product = await prisma.product.update({
      where: {
        id,
        organizationId,
      },
      data: body,
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    const organizationId = session.user?.organizationId;
    if (!organizationId) {
      return new NextResponse("Missing organization ID", { status: 400 });
    }

    const body = await req.json();
    const product = await prisma.product.update({
      where: {
        id,
        organizationId,
      },
      data: body,
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "PRODUCT UPDATED",
        details: `Product ${product.name} (${product.sku}) has been updated`,
        user: { connect: { id: session.user.id } },
        notifications: {
          create: {
            user: { connect: { id: session.user.id } },
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    const organizationId = session.user?.organizationId;
    if (!organizationId) {
      return new NextResponse("Missing organization ID", { status: 400 });
    }

    const product = await prisma.product.delete({
      where: {
        id,
        organizationId,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "PRODUCT DELETED",
        details: `Product ${product.name} (${product.sku}) has been deleted`,
        user: { connect: { id: session.user.id } },
        notifications: {
          create: {
            user: { connect: { id: session.user.id } },
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
