import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<Record<string, string>> }
) {
  // Await the params before destructuring
  const paramsObject = await params;
  const vendorId = paramsObject.id;

  if (!vendorId) {
    return new NextResponse("Vendor ID not provided", { status: 400 });
  }

  // Example: parse JSON body from the request
  const body = await request.json();
  const { name } = body;

  const prisma = new PrismaClient();
  try {
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: { name },
    });
    return NextResponse.json(updatedVendor);
  } catch (error) {
    console.error("Failed to update vendor:", error);
    return new NextResponse("Failed to update vendor", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
