import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Type definitions
type CustomerResponse = {
  customer?: any;
  success?: boolean;
  error?: string;
  issues?: z.ZodIssue[];
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

// Validation schema
const customerUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  type: z.enum(["RETAIL", "WHOLESALE", "THIRDPARTY"]),
  address: z.string().optional(),
});

// Helper function to check if customer exists
async function checkCustomerExists(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });
  return customer;
}

// GET handler
export async function GET(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse<CustomerResponse>> {
  try {
    const { id } = await params;
    const customer = await checkCustomerExists(id);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error("Failed to fetch customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

// PUT handler
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse<CustomerResponse>> {
  try {
    const { id } = await params;

    // Check if customer exists
    const existingCustomer = await checkCustomerExists(id);
    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const data = await request.json();

    // Validate request data
    const validationResult = customerUpdateSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input data", issues: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Check if email is being changed and if it already exists
    const emailConflict = await prisma.customer.findFirst({
      where: {
        email: data.email,
        NOT: {
          id,
        },
      },
    });

    if (emailConflict) {
      return NextResponse.json(
        { error: "Email already in use by another customer" },
        { status: 409 }
      );
    }

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        type: data.type,
        address: data.address ?? null,
      },
    });

    return NextResponse.json({ customer: updatedCustomer });
  } catch (error) {
    console.error("Failed to update customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse<CustomerResponse>> {
  try {
    const { id } = await params;

    // Check if customer exists
    const existingCustomer = await checkCustomerExists(id);
    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
