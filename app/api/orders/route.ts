// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

// Validation schemas
const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

const orderSchema = z.object({
  customerId: z.string().min(1),
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

function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `ORD-${timestamp}-${random}`;
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: "Unauthorized or missing organization" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// app/api/orders/route.ts
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.organizationId) {
      return NextResponse.json(
        { error: "Unauthorized or missing organization" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Incoming order data:", JSON.stringify(body, null, 2));

    const validatedData = orderSchema.parse(body);

    // Verify customer exists
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

    const total = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const orderNumber = generateOrderNumber();

    try {
      // Create the order first
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          total,
          status: validatedData.status,
          paymentStatus: validatedData.paymentStatus,
          paymentType: validatedData.paymentType,
          shippingAddress: validatedData.shippingAddress,
          notes: validatedData.notes,
          customerId: validatedData.customerId,
          organizationId: session.user.organizationId,
        },
      });

      // Create order items
      const orderItems = await prisma.orderItem.createMany({
        data: validatedData.items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      // Update product quantities and create movements
      for (const item of validatedData.items) {
        // Verify product and check stock
        const product = await prisma.product.findFirst({
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

        // Update product quantity
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });

        // Create inventory movement
        await prisma.inventoryMovement.create({
          data: {
            type: "SALE",
            quantity: -item.quantity,
            reference: orderNumber,
            notes: `Order ${orderNumber} sale`,
            productId: item.productId,
            userId: session.user.id,
            orderId: newOrder.id,
          },
        });
      }

      // Fetch complete order with relations
      const completeOrder = await prisma.order.findUnique({
        where: { id: newOrder.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
        },
      });

      return NextResponse.json(completeOrder);
    } catch (error) {
      console.error("Error creating order:", error);

      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(
        { error: "Failed to process order" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to create order:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
