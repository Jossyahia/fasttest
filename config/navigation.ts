// config/navigation.ts
import { UserRole } from "@prisma/client";
import Link from "next/link";

export type IconName =
  | "dashboard"
  | "chart"
  | "package"
  | "boxes"
  | "folder"
  | "warehouse"
  | "shopping-cart"
  | "rotate-ccw"
  | "users"
  | "handshake"
  | "settings"
  | "credit-card";

export type NavItem = {
  title: string;
  href: string;
  icon: IconName;
  roles?: UserRole[];
  badge?: "new" | "beta";
};

export type NavSection = {
  title: string;
  items: NavItem[];
};
export const navigation: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "dashboard",
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: "chart",
        roles: ["ADMIN", "STAFF"],
      },
    ],
  },
  {
    title: "Inventory",
    items: [
      {
        title: "Products",
        href: "/products",
        icon: "package",
      },
      {
        title: "Inventory",
        href: "/inventory",
        icon: "boxes",
      },
      {
        title: "Categories",
        href: "/categories",
        icon: "folder",
      },
      {
        title: "Warehouses",
        href: "/warehouses",
        icon: "warehouse",
      },
    ],
  },
  {
    title: "Orders",
    items: [
      {
        title: "All Orders",
        href: "/orders",
        icon: "shopping-cart",
      },
      {
        title: "Returns",
        href: "/returns",
        icon: "rotate-ccw",
      },
    ],
  },
  {
    title: "Customers",
    items: [
      {
        title: "Customers",
        href: "/customers",
        icon: "users",
      },
      {
        title: "Partners",
        href: "/partners",
        icon: "handshake",
        roles: ["ADMIN", "STAFF"],
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "General",
        href: "/settings",
        icon: "settings",
        roles: ["ADMIN"],
      },
      {
        title: "Users",
        href: "/settings/users",
        icon: "users",
        roles: ["ADMIN"],
      },
      {
        title: "Billing",
        href: "/settings/billing",
        icon: "credit-card",
        roles: ["ADMIN"],
      },
    ],
  },
];
