// lib/permissions.ts
import { UserRole } from "@prisma/client";

type Action =
  | "create:product"
  | "update:product"
  | "delete:product"
  | "create:order"
  | "update:order"
  | "delete:order"
  | "manage:users"
  | "manage:settings";

const permissions: Record<UserRole, Action[]> = {
  ADMIN: [
    "create:product",
    "update:product",
    "delete:product",
    "create:order",
    "update:order",
    "delete:order",
    "manage:users",
    "manage:settings",
  ],
  STAFF: ["create:product", "update:product", "create:order", "update:order"],
  CUSTOMER: ["create:order"],
  PARTNER: ["create:order", "update:order"],
};

export function hasPermission(userRole: UserRole, action: Action): boolean {
  return permissions[userRole].includes(action);
}
