import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// Validation schema for order updates
const orderUpdateSchema = z.object({
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
  shippingAddress: z.string(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
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
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Validate the input data
    const validationResult = orderUpdateSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input data", issues: validationResult.error.issues },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        paymentStatus: data.paymentStatus,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
      },
      include: {
        items: true,
        customer: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to update order:", error);
    // Fixed the syntax error in the error response
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
