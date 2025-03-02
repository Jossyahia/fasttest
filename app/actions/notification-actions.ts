// app/actions/notification-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markActivityAsRead(activityId: string) {
  try {
    if (!activityId) {
      return {
        success: false,
        message: "Activity ID is required",
      };
    }

    const activity = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        read: true,
      },
    });

    revalidatePath("/notifications");

    return {
      success: true,
      data: activity,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error marking activity as read:", error.message);
    }
    return {
      success: false,
      message: "Failed to mark activity as read",
    };
  }
}
