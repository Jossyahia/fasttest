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

  const body = await request.json();
  const { name } = body;

  const prisma = new PrismaClient();
  try {
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: { name },
    });

    // // Log activity
    // await prisma.activity.create({
    //   data: {
    //     action: "VENDOR UPDATED",
    //     details: `Vendor ${name} has been updated`,
    //     user: { connect: { id: session.user.id } },
    //     notifications: {
    //       create: {
    //         user: { connect: { id: session.user.id } },
    //       },
    //     },
    //   },
    // });
    return NextResponse.json(updatedVendor);
  } catch (error) {
    console.error("Failed to update vendor:", error);
    return new NextResponse("Failed to update vendor", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}



export async function DELETE(
  request: Request,
  { params }: { params: Promise<Record<string, string>> }
) {
  // Await the params before destructuring
  const paramsObject = await params;
  const vendorId = paramsObject.id;

  if (!vendorId) {
    return new NextResponse("Vendor ID not provided", { status: 400 });
  }

  const prisma = new PrismaClient();
  try {
    await prisma.vendor.delete({
      where: { id: vendorId },
    });

    // // Log activity
    // await prisma.activity.create({
    //   data: {
    //     action: "VENDOR DELETED",
    //     details: `Vendor ${name} has been deleted`,
    //     user: { connect: { id: session.user.id } },
    //     notifications: {
    //       create: {
    //         user: { connect: { id: session.user.id } },
    //       },
    //     },
    //   },
    // });
    return new NextResponse("Vendor deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Failed to delete vendor:", error);
    return new NextResponse("Failed to delete vendor", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
