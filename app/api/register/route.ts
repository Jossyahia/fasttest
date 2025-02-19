import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";

// Import the actual Prisma-generated enums
import { CustomerType, UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  if (!request.body) {
    return new Response(JSON.stringify({ error: "Request body is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return new Response(
        JSON.stringify({ error: "Invalid request body format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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
        JSON.stringify({
          error: "Missing required fields",
          details: {
            name: !name,
            email: !email,
            password: !password,
            organizationName: !organizationName,
            customerType: !customerType,
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate customer type
    if (!Object.values(CustomerType).includes(customerType)) {
      return new Response(
        JSON.stringify({
          error: "Invalid customer type",
          validTypes: Object.values(CustomerType),
        }),
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
        const customer = await tx.customer.create({
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
            currency: "NGN",
            notificationEmail: email,
          },
        });

        // 5. Create default warehouse
        const warehouse = await tx.warehouse.create({
          data: {
            name: "Main Warehouse",
            location: "Default Location",
            organizationId: organization.id,
          },
        });

        // 5.5 Create default vendor
        const vendor = await tx.vendor.create({
          data: {
            name: "Default Vendor",
            location: "Default Location",
            organizationId: organization.id,
          },
        });

        // 6. Create default product
        await tx.product.create({
          data: {
            sku: `SKU-${randomUUID().slice(0, 8)}`,
            name: "Sample Product",
            description: "Default product created with account",
            quantity: 0,
            minStock: 10,
            status: "ACTIVE",
            organizationId: organization.id,
            warehouseId: warehouse.id,
            vendorId: vendor.id, // Add the vendor ID here
          },
        });

        // 7. Create activity log
        await tx.activity.create({
          data: {
            action: "ACCOUNT_CREATED",
            details: JSON.stringify({
              event: "New account registration",
              organization: organizationName,
              customerType,
            }),
            userId: user.id,
          },
        });

        return { user, organization, customer };
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Account created successfully",
          data: {
            organizationId: result.organization.id,
            userId: result.user.id,
            customerId: result.customer.id,
          },
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Transaction error:", error);

      let errorMessage = "Failed to create account. Please try again.";

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          errorMessage =
            "A unique constraint would be violated. Please check your input.";
        } else {
          errorMessage = `Database error: ${error.message}`;
        }
      }

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Registration error:", error);

    return new Response(
      JSON.stringify({
        error: "Invalid request format or missing data",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
