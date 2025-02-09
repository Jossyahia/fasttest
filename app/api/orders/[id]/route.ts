import { NextResponse } from "next/server";
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await checkAuth();

    const order = await prisma.order.findUnique({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await context.params;
  try {
    const session = await checkAuth();
    const body = await req.json();
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
      where: {
        id: orderId,
        organizationId: session.user.organizationId,
      },
      include: {
        items: true,
        movements: true,
      },
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
        // Restore previous stock
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          });
        }

        // Clear old data
        await tx.inventoryMovement.deleteMany({
          where: { orderId },
        });

        await tx.orderItem.deleteMany({
          where: { orderId },
        });

        // Validate new stock
        for (const item of validatedData.items) {
          const product = await tx.product.findFirst({
            where: {
              id: item.productId,
              organizationId: session.user.organizationId,
            },
          });

          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          if (product.quantity < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.name}`);
          }
        }

        // Update order
        const order = await tx.order.update({
          where: { id: orderId },
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

        // Create new items
        await tx.orderItem.createMany({
          data: validatedData.items.map((item) => ({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        // Update stock and create movements
        for (const item of validatedData.items) {
          await tx.inventoryMovement.create({
            data: {
              type: "SALE",
              quantity: -item.quantity,
              reference: existingOrder.orderNumber,
              notes: `Order ${existingOrder.orderNumber} updated`,
              productId: item.productId,
              userId: session.user.id,
              orderId: order.id,
            },
          });

          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }

        return tx.order.findUnique({
          where: { id: orderId },
          include: {
            items: {
              include: {
                product: true,
              },
            },
            customer: true,
          },
        });
      });

      if (!updatedOrder) {
        throw new Error("Failed to update order");
      }

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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await checkAuth();

    const existingOrder = await prisma.order.findUnique({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
      include: {
        items: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    try {
      await prisma.$transaction(async (tx) => {
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          });
        }

        await tx.inventoryMovement.deleteMany({
          where: { orderId: id },
        });

        await tx.orderItem.deleteMany({
          where: { orderId: id },
        });

        await tx.order.delete({
          where: { id },
        });

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
    } catch (txError) {
      console.error("Transaction failed:", txError);
      if (txError instanceof Error) {
        return NextResponse.json({ error: txError.message }, { status: 400 });
      }
      throw txError;
    }
  } catch (error) {
    console.error("Failed to delete order:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
