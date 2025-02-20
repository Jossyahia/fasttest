"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UserNav } from "./user-nav";
import NotificationsComponent from "@/components/notifications/NotificationsComponent";
import { useState, useEffect } from "react";

interface TopNavProps {
  onMobileMenuClick?: () => void;
}

const NotificationsDropdown = () => {
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {hasNewNotifications && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[300px] sm:w-[350px] max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel className="text-base">
            Notifications
          </DropdownMenuLabel>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={() => setHasNewNotifications(false)}
          >
            Mark all as read
          </Button>
        </div>
        <DropdownMenuSeparator />
        <NotificationsComponent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Navigation links dropdown for mobile
const NavLinksDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 md:hidden">
          Navigate
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="w-full cursor-pointer">
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/inventory" className="w-full cursor-pointer">
            Inventory
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/vendors" className="w-full cursor-pointer">
            Vendors
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/warehouse" className="w-full cursor-pointer">
            Warehouse
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/reports" className="w-full cursor-pointer">
            Reports
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function TopNav({ onMobileMenuClick }: TopNavProps) {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Brand and mobile menu button */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMobileMenuClick}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <span className="hidden sm:inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white">
                FI
              </span>
              <span className="text-lg font-semibold tracking-tight">
                FastInv Pro
              </span>
            </Link>
          </div>

          {/* Desktop navigation links */}
          <nav className="hidden md:flex items-center gap-6 mx-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/inventory"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Inventory
            </Link>
            <Link
              href="/vendors"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Vendors
            </Link>
            <Link
              href="/warehouses"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Warehouses
            </Link>
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Reports
            </Link>
          </nav>

          {/* Right side - mobile nav dropdown, notifications and user */}
          <div className="flex items-center gap-2">
            <NavLinksDropdown />
            <NotificationsDropdown />
            <UserNav user={session?.user} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNav;
