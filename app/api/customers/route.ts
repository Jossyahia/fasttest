// app/api/customers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Type definitions
type CustomerResponse = {
  customers?: any[]
  error?: string
}

// Validation schema
const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  type: z.enum(["RETAIL", "WHOLESALE", "THIRDPARTY"]),
  address: z.string().optional(),
});

// GET handler
export async function GET(
  request: NextRequest
): Promise<NextResponse<CustomerResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    
    const customers = await prisma.customer.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      } : {},
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST handler
export async function POST(
  request: NextRequest
): Promise<NextResponse<CustomerResponse>> {
  try {
    const data = await request.json()
    
    // Validate request data
    const validationResult = customerSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', issues: validationResult.error.issues },
        { status: 400 }
      )
    }

    // Check for existing customer
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: data.email }
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 409 }
      )
    }

    // Create new customer
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        type: data.type,
        address: data.address ?? null,
      }
    })

    return NextResponse.json({ customers: [customer] }, { status: 201 })
  } catch (error) {
    console.error('Failed to create customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}