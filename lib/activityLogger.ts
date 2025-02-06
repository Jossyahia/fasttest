import { prisma } from "@/lib/prisma";

export interface ActivityLogOptions {
  userId: string;
  action: string;
  details?: string;
}

export const ActivityTypes = {
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
  ORDER_CREATED: "ORDER_CREATED",
  ORDER_UPDATED: "ORDER_UPDATED",
  PRODUCT_ADDED: "PRODUCT_ADDED",
  PRODUCT_UPDATED: "PRODUCT_UPDATED",
  INVENTORY_ADJUSTED: "INVENTORY_ADJUSTED",
};

export async function logActivity(options: ActivityLogOptions) {
  try {
    return await prisma.activity.create({
      data: {
        userId: options.userId,
        action: options.action,
        details: options.details || "",
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    throw error;
  }
}
