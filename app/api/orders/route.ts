import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export enum InventoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISCONTINUED = "DISCONTINUED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED",
}

export enum PaymentType {
  PREPAID = "PREPAID",
  PAY_ON_DELIVERY = "PAY_ON_DELIVERY",
  CREDIT = "CREDIT",
}

// Validation schemas
const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

const orderSchema = z.object({
  customerId: z.string().min(1),
  paymentType: z.enum([
    PaymentType.PREPAID,
    PaymentType.PAY_ON_DELIVERY,
    PaymentType.CREDIT,
  ]),
  status: z.enum([
    OrderStatus.PENDING,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ]),
  paymentStatus: z.enum([
    PaymentStatus.PENDING,
    PaymentStatus.PAID,
    PaymentStatus.PARTIALLY_PAID,
    PaymentStatus.REFUNDED,
    PaymentStatus.FAILED,
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

async function validateCustomer(customerId: string, organizationId: string) {
  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      organizationId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
}

async function validateProducts(
  items: z.infer<typeof orderItemSchema>[],
  organizationId: string
) {
  for (const item of items) {
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
        organizationId,
        status: InventoryStatus.ACTIVE,
      },
    });

    if (!product) {
      throw new Error(`Product ${item.productId} not found or not active`);
    }

    if (product.quantity < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}`);
    }
  }
}

async function createOrderWithItems(
  orderData: z.infer<typeof orderSchema>,
  organizationId: string,
  userId: string
) {
  const orderNumber = generateOrderNumber();
  const total = orderData.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const newOrder = await prisma.order.create({
    data: {
      orderNumber,
      total,
      status: orderData.status,
      paymentStatus: orderData.paymentStatus,
      paymentType: orderData.paymentType,
      shippingAddress: orderData.shippingAddress,
      notes: orderData.notes,
      customerId: orderData.customerId,
      organizationId,
    },
  });

  await prisma.orderItem.createMany({
    data: orderData.items.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
  });

  // Update product quantities and create movements
  for (const item of orderData.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        quantity: {
          decrement: item.quantity,
        },
      },
    });

    await prisma.inventoryMovement.create({
      data: {
        type: "SALE",
        quantity: -item.quantity,
        reference: orderNumber,
        notes: `Order ${orderNumber} sale`,
        productId: item.productId,
        userId,
        orderId: newOrder.id,
      },
    });
  }

  return prisma.order.findUnique({
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
}

export async function GET() {
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
    const validatedData = orderSchema.parse(body);

    await validateCustomer(
      validatedData.customerId,
      session.user.organizationId
    );
    await validateProducts(validatedData.items, session.user.organizationId);

    const completeOrder = await createOrderWithItems(
      validatedData,
      session.user.organizationId,
      session.user.id
    );

    return NextResponse.json(completeOrder);
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

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
