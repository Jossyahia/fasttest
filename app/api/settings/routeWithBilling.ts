import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
  lowStockThreshold: z.number().min(0),
  currency: z.string().min(1),
  notificationEmail: z.string().email().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = settingsSchema.parse(json);

    const settings = await prisma.settings.upsert({
      where: {
        organizationId: session.user.organizationId,
      },
      update: body,
      create: {
        ...body,
        organizationId: session.user.organizationId,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
