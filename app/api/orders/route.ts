// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be non-negative"),
});

const orderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body against schema
    const validatedData = orderSchema.parse(body);

    // Calculate total
    const total = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Generate order number (you can customize this format)
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Start a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Check stock availability for all items
      for (const item of validatedData.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for product: ${product.name}. Available: ${product.quantity}`
          );
        }
      }

      // Create the order
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: validatedData.customerId,
          status: validatedData.status,
          paymentStatus: validatedData.paymentStatus,
          total,
          items: {
            create: validatedData.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
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

      // Update product quantities
      for (const item of validatedData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to create order:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
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
