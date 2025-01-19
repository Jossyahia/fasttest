import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { CustomerType, UserRole, Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      password,
      organizationName,
      customerType,
      phone,
      address,
    } = body;

    // Validate required fields
    if (!name || !email || !password || !organizationName || !customerType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Password length validation
    if (password.length < 6) {
      return new Response(
        JSON.stringify({
          error: "Password must be at least 6 characters long",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create organization
        const organization = await tx.organization.create({
          data: {
            name: organizationName,
          },
        });

        // 2. Create user
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: UserRole.CUSTOMER,
            organizationId: organization.id,
          },
        });

        // 3. Create customer
        await tx.customer.create({
          data: {
            name,
            email,
            phone: phone || null,
            address: address || null,
            type: customerType as CustomerType,
            organizationId: organization.id,
          },
        });

        // 4. Create settings
        await tx.settings.create({
          data: {
            organizationId: organization.id,
            lowStockThreshold: 10,
            currency: "USD",
            notificationEmail: email,
          },
        });

        // 5. Create default warehouse
        await tx.warehouse.create({
          data: {
            name: "Main Warehouse",
            location: "Default Location",
            organizationId: organization.id,
          },
        });

        // 6. Create initial activity log
        await tx.activity.create({
          data: {
            action: "ACCOUNT_CREATED",
            details: "User account and organization created",
            userId: user.id,
          },
        });

        return { user, organization };
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Account created successfully",
          organizationId: result.organization.id,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Transaction error:", error);

      let errorMessage = "Failed to create account. Please try again.";

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        errorMessage = `Database error: ${error.message}`;
      }

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Registration error:", error);

    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
