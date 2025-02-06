// app/api/activities/route.ts
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const activities = await prisma.activity.findMany({
      where: {
        user: {
          organizationId: session.user.organizationId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error("[ACTIVITIES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
