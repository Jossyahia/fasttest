"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  PackageSearch,
  LayoutDashboard,
  Users,
  Settings,
  ChevronRight,
  Store,
  ShoppingCart,
  Users2,
  Warehouse,
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// Define the structure of a navigation item
interface NavItemType {
  href: string;
  title: string;
  icon: LucideIcon;
}

// Define the structure of a navigation group
interface NavGroupType {
  title: string;
  items: NavItemType[];
}

// Define the props for the NavItem component
interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
  onClick?: () => void;
}

// Define the props for the NavGroup component
interface NavGroupProps {
  group: NavGroupType;
  pathname: string;
  onItemClick?: () => void;
}

// Navigation items data
const navigationItems: NavGroupType[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Inventory",
        href: "/inventory",
        icon: PackageSearch,
      },
      {
        title: "Products",
        href: "/products",
        icon: Store,
      },
      {
        title: "Orders",
        href: "/orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        title: "Customers",
        href: "/customers",
        icon: Users2,
      },
      {
        title: "Users",
        href: "/users",
        icon: Users,
      },
      {
        title: "Warehouses",
        href: "/warehouses",
        icon: Warehouse,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

// NavItem Component
function NavItem({ item, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive
          ? "bg-gray-100 dark:bg-gray-800 text-primary font-medium"
          : "text-gray-700 dark:text-gray-300"
      )}
      onClick={onClick}
    >
      <item.icon className="w-5 h-5 shrink-0" />
      <span className="text-sm">{item.title}</span>
      {isActive && <ChevronRight className="w-4 h-4 ml-auto shrink-0" />}
    </Link>
  );
}

// NavGroup Component
function NavGroup({ group, pathname, onItemClick }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isActiveGroup = group.items.some((item) => pathname === item.href);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center w-full gap-2 p-2 text-xs font-medium rounded-lg",
          "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
          isActiveGroup && "text-gray-900 dark:text-gray-100"
        )}
      >
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform",
            isOpen ? "rotate-0" : "-rotate-90"
          )}
        />
        {group.title}
      </button>
      {isOpen && (
        <div className="space-y-1 ml-2">
          {group.items.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              onClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Sidebar Component
export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="space-y-6">
      {navigationItems.map((group) => (
        <NavGroup
          key={group.title}
          group={group}
          pathname={pathname}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-white dark:bg-gray-950 min-h-screen p-4">
        <div className="mb-6 px-3">
          <Link
            href="/"
            className="inline-block hover:text-primary transition-colors"
          >
            <h2 className="text-lg font-semibold">FastIv Pro</h2>
          </Link>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
            onClick={() => setIsOpen(true)}
          ></Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <SheetHeader className="mb-6">
            <Link
              href="/"
              className="inline-block hover:text-primary transition-colors"
              onClick={closeSheet}
            >
              <SheetTitle>FastInv Pro</SheetTitle>
            </Link>
          </SheetHeader>
          <SidebarContent onItemClick={closeSheet} />
        </SheetContent>
      </Sheet>
    </>
  );
}
