// components/layout/sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  PackageSearch,
  LayoutDashboard,
  Users,
  Settings,
  ChevronRight,
} from "lucide-react";

// Define the navigation items
const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: PackageSearch,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  { title: "Products", href: "/products", icon: Settings },
  { title: "Orders", href: "/orders", icon: Users },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Warehouses", href: "/warehouses", icon: PackageSearch },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-50 border-r min-h-screen p-4">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                "hover:bg-gray-100",
                isActive ? "bg-gray-100 text-primary" : "text-gray-600"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
