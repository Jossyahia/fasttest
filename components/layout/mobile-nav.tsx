"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  X,
  LayoutDashboard,
  BarChart3,
  Package,
  Boxes as BoxesIcon,
  FolderOpen,
  Store,
  ShoppingCart,
  RotateCcw,
  Users,
  HandShake,
  Settings,
  CreditCard,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navigation } from "@/config/navigation";
import { UserRole } from "@prisma/client";

// Define icons mapping with explicit typing and verified icons
const Icons: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  chart: BarChart3,
  package: Package,
  boxes: BoxesIcon,
  folder: FolderOpen,
  warehouse: Store,
  "shopping-cart": ShoppingCart,
  "rotate-ccw": RotateCcw,
  users: Users,
  handshake: HandShake,
  settings: Settings,
  "credit-card": CreditCard,
};

interface NavigationItem {
  title: string;
  href: string;
  icon: string;
  badge?: "new" | "beta";
  roles?: UserRole[];
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface MobileNavProps {
  show: boolean;
  onClose: () => void;
}

const MobileNav = ({ show, onClose }: MobileNavProps) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) return null;

  const renderIcon = (iconName: string) => {
    const IconComponent = Icons[iconName];
    if (!IconComponent) {
      console.warn(`Icon "${iconName}" not found in Icons mapping`);
      return null;
    }
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 left-0 w-full max-w-xs border-r bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="font-bold">Inventory System</span>
          </Link>
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
          <nav className="flex flex-col space-y-2">
            {navigation.map((section: NavigationSection, index: number) => {
              const items = section.items.filter(
                (item) =>
                  !item.roles ||
                  (session?.user?.role &&
                    item.roles.includes(session?.user?.role as UserRole))
              );

              if (items.length === 0) return null;

              return (
                <div key={index} className="py-2">
                  <h4 className="px-2 text-xs font-semibold text-muted-foreground">
                    {section.title}
                  </h4>
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {renderIcon(item.icon)}
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs font-medium text-primary">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MobileNav;
