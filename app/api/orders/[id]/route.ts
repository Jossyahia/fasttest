import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

const orderSchema = z.object({
  customerId: z.string(),
  paymentType: z.enum(["PREPAID", "PAY_ON_DELIVERY", "CREDIT"]),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  paymentStatus: z.enum([
    "PENDING",
    "PAID",
    "PARTIALLY_PAID",
    "REFUNDED",
    "FAILED",
  ]),
  items: z.array(orderItemSchema).nonempty(),
  shippingAddress: z.string().min(1).optional(),
  notes: z.string().optional(),
});

async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

// ✅ Fix: Use `NextRequest` correctly
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop(); // Extract `id`
    if (!id)
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );

    const session = await checkAuth();
    const order = await prisma.order.findUnique({
      where: { id, organizationId: session.user.organizationId },
      include: { customer: true, items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id)
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );

    const session = await checkAuth();
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const validatedData = orderSchema.parse(body);
    const customer = await prisma.customer.findFirst({
      where: {
        id: validatedData.customerId,
        organizationId: session.user.organizationId,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id, organizationId: session.user.organizationId },
      include: { items: true, movements: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const total = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    try {
      const updatedOrder = await prisma.$transaction(async (tx) => {
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { quantity: { increment: item.quantity } },
          });
        }

        await tx.inventoryMovement.deleteMany({ where: { orderId: id } });
        await tx.orderItem.deleteMany({ where: { orderId: id } });

        for (const item of validatedData.items) {
          const product = await tx.product.findFirst({
            where: {
              id: item.productId,
              organizationId: session.user.organizationId,
            },
          });

          if (!product) throw new Error(`Product ${item.productId} not found`);
          if (product.quantity < item.quantity)
            throw new Error(`Insufficient stock for product ${product.name}`);
        }

        await tx.order.update({
          where: { id },
          data: {
            total,
            status: validatedData.status,
            paymentStatus: validatedData.paymentStatus,
            paymentType: validatedData.paymentType,
            shippingAddress: validatedData.shippingAddress,
            notes: validatedData.notes,
            customerId: validatedData.customerId,
          },
        });

        await tx.orderItem.createMany({
          data: validatedData.items.map((item) => ({
            orderId: id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        for (const item of validatedData.items) {
          await tx.inventoryMovement.create({
            data: {
              type: "SALE",
              quantity: -item.quantity,
              reference: existingOrder.orderNumber,
              notes: `Order ${existingOrder.orderNumber} updated`,
              productId: item.productId,
              userId: session.user.id,
              orderId: id,
            },
          });

          await tx.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          });
        }

        return tx.order.findUnique({
          where: { id },
          include: { items: { include: { product: true } }, customer: true },
        });
      });

      return NextResponse.json(updatedOrder);
    } catch (txError) {
      console.error("Transaction failed:", txError);
      return NextResponse.json(
        {
          error:
            txError instanceof Error ? txError.message : "Transaction failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id)
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );

    const session = await checkAuth();
    const existingOrder = await prisma.order.findUnique({
      where: { id, organizationId: session.user.organizationId },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of existingOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } },
        });
      }

      await tx.inventoryMovement.deleteMany({ where: { orderId: id } });
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      await tx.order.delete({ where: { id } });

      for (const item of existingOrder.items) {
        await tx.inventoryMovement.create({
          data: {
            type: "RETURN",
            quantity: item.quantity,
            reference: existingOrder.orderNumber,
            notes: `Order ${existingOrder.orderNumber} deleted - stock returned`,
            productId: item.productId,
            userId: session.user.id,
          },
        });
      }
    });

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
