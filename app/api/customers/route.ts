// app/api/customers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/auth";
import { CustomerType } from "@prisma/client";

// Type definitions
interface CustomerResponse {
  customers?: any[];
  error?: string;
  issues?: z.ZodIssue[];
}

// Validation schema
const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  type: z.enum(["RETAIL", "WHOLESALE", "THIRDPARTY"] as const),
  address: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    const customers = await prisma.customer.findMany({
      where: {
        organizationId: session.user.organizationId,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate request data
    const validationResult = customerSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          issues: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Check for existing customer in the same organization
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        email: data.email,
        organizationId: session.user.organizationId,
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        {
          error: "Customer with this email already exists",
        },
        { status: 409 }
      );
    }

    // Create new customer
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type as CustomerType,
        address: data.address,
        organizationId: session.user.organizationId,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        action: "CUSTOMER_CREATED",
        details: `Customer ${customer.name} created`,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    console.error("Failed to create customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
