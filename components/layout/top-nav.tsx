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
} from "@/components/ui/dropdown-menu";
import { UserNav } from "./user-nav";
import NotificationsComponent from "@/components/notifications/NotificationsComponent";

interface TopNavProps {
  onMobileMenuClick?: () => void;
}

const NotificationsDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Notifications</span>
        <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500">
          <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
        </div>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-[300px]">
      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <NotificationsComponent />
    </DropdownMenuContent>
  </DropdownMenu>
);

export function TopNav({ onMobileMenuClick }: TopNavProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Mobile menu button and brand */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={onMobileMenuClick}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
            <Link href="/" className="text-lg font-bold">
              FastInv Pro
            </Link>
          </div>
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NotificationsDropdown />
            <UserNav user={session?.user} />
          </div>
          {/* Mobile notifications and user nav */}
          <div className="flex items-center md:hidden space-x-2">
            <NotificationsDropdown />
            <UserNav user={session?.user} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNav;
