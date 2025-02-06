import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Verify authentication using Auth.js.
  const session = await auth();

  // Check if session exists and has a user
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizationId = session.user.organizationId;

  try {
    // Fetch all customers for the organization.
    const customers = await prisma.customer.findMany({
      where: { organizationId },
    });
    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  // Check if session exists and has a user
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizationId = session.user.organizationId;

  try {
    const body = await request.json();
    const { name, email, phone, type, address } = body;

    // Create a new customer associated with the current organization.
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        type, // Must match one of your enum values (RETAIL, WHOLESALE, THIRDPARTY)
        address,
        organization: { connect: { id: organizationId } },
      },
    });

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to add customer" },
      { status: 500 }
    );
  }
}
