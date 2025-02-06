import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<Response> {
  try {
    const { userId } = await params;
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: session.user.organizationId,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    await prisma.user.delete({ where: { id: userId } });

    return new Response(
      JSON.stringify({ message: "User deleted successfully" })
    );
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new Response(JSON.stringify({ error: "Internal Error" }), {
      status: 500,
    });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<Response> {
  try {
    const { userId } = await params;
    const session = await auth();

    if (!session?.user?.organizationId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
      });
    }

    const { name, role } = body as { name?: string; role?: string };
    if (!name || !role) {
      return new Response(
        JSON.stringify({ error: "Name and role are required" }),
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: session.user.organizationId,
      },
    });

    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, role },
    });

    return new Response(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("[USER_UPDATE]", error);
    return new Response(JSON.stringify({ error: "Internal Error" }), {
      status: 500,
    });
  }
}
