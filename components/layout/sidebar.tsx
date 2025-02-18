"use client";

import { useState, useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  isCollapsed?: boolean;
  onClick?: () => void;
}

// Define the props for the NavGroup component
interface NavGroupProps {
  group: NavGroupType;
  pathname: string;
  isCollapsed?: boolean;
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
function NavItem({ item, isActive, onClick, isCollapsed }: NavItemProps) {
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                "flex items-center justify-center h-10 w-10 rounded-lg transition-all",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 text-primary"
                  : "text-gray-700 dark:text-gray-300"
              )}
              onClick={onClick}
            >
              <item.icon className="w-5 h-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-1 bg-gray-900 text-white">
            {item.title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive
          ? "bg-gray-100 dark:bg-gray-800 text-primary font-medium"
          : "text-gray-700 dark:text-gray-300"
      )}
      onClick={onClick}
    >
      <item.icon className="w-5 h-5 shrink-0" />
      <span className="text-sm">{item.title}</span>
      {isActive && (
        <ChevronRight className="w-4 h-4 ml-auto shrink-0 opacity-70" />
      )}
    </Link>
  );
}

// NavGroup Component
function NavGroup({
  group,
  pathname,
  onItemClick,
  isCollapsed,
}: NavGroupProps) {
  // Check if any item in this group is active
  const isActiveGroup = group.items.some((item) => pathname === item.href);
  // Keep group open if any item is active or by default for expanded view
  const [isOpen, setIsOpen] = useState(isActiveGroup);

  // Update isOpen if an item becomes active
  useEffect(() => {
    if (isActiveGroup && !isOpen) {
      setIsOpen(true);
    }
  }, [isActiveGroup, isOpen]);

  // If sidebar is collapsed, render a simplified version
  if (isCollapsed) {
    return (
      <div className="py-2">
        {group.items.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            onClick={onItemClick}
            isCollapsed
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center w-full gap-2 p-2 text-xs font-medium rounded-lg transition-colors",
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

// Custom hook for the media query if not already defined
const useMediaQueryFallback = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatches = () => setMatches(media.matches);

    // Initialize
    updateMatches();
    // Listen for changes
    media.addEventListener("change", updateMatches);
    return () => media.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
};

// Sidebar Component
export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Use the hook if available, otherwise use the fallback
  const mediaQueryHook =
    typeof useMediaQuery === "function" ? useMediaQuery : useMediaQueryFallback;
  const isDesktop = mediaQueryHook("(min-width: 1024px)");
  const isMedium = mediaQueryHook("(min-width: 768px) and (max-width: 1023px)");

  // Auto-collapse sidebar on medium screens
  useEffect(() => {
    if (isMedium) {
      setIsCollapsed(true);
    } else if (isDesktop) {
      setIsCollapsed(false);
    }
  }, [isMedium, isDesktop]);

  const closeSheet = () => setIsOpen(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <ScrollArea
      className={cn("h-[calc(100vh-80px)]", isCollapsed ? "w-16" : "w-full")}
    >
      <nav className={cn("space-y-6", isCollapsed ? "px-2" : "px-1")}>
        {navigationItems.map((group) => (
          <NavGroup
            key={group.title}
            group={group}
            pathname={pathname}
            onItemClick={onItemClick}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </ScrollArea>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-white dark:bg-gray-950 h-screen transition-all duration-300 sticky top-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between h-16 border-b px-3 sticky top-0 bg-white dark:bg-gray-950",
            isCollapsed ? "justify-center" : "px-4"
          )}
        >
          {!isCollapsed && (
            <Link
              href="/"
              className="inline-block hover:text-primary transition-colors"
            >
              <h2 className="text-lg font-semibold">FastInv Pro</h2>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className={cn(
              "rounded-full hover:bg-gray-100 dark:hover:bg-gray-800",
              isCollapsed && "rotate-180"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <SidebarContent />
      </aside>

      {/* Tablet Sidebar (Collapsed) */}
      <aside
        className={cn(
          "hidden md:flex lg:hidden flex-col border-r bg-white dark:bg-gray-950 h-screen w-16 sticky top-0"
        )}
      >
        <div className="flex items-center justify-center h-16 border-b px-3 sticky top-0 bg-white dark:bg-gray-950">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white"
                >
                  <span className="text-sm font-bold">FI</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="ml-1 bg-gray-900 text-white"
              >
                FastInv Pro
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40 rounded-full border-gray-200 dark:border-gray-800"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 border-r border-gray-200 dark:border-gray-800"
        >
          <SheetHeader className="h-16 flex items-center border-b px-4">
            <div className="flex items-center justify-between w-full">
              <Link
                href="/"
                className="inline-block hover:text-primary transition-colors"
                onClick={closeSheet}
              >
                <SheetTitle>FastInv Pro</SheetTitle>
              </Link>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          <div className="p-4">
            <SidebarContent onItemClick={closeSheet} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Sidebar;
