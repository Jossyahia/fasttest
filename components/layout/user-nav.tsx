"use client";

import { signIn, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
  ChevronDown,
  UserCircle2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface UserNavProps {
  user?: User | null;
  isLoading?: boolean;
}

export function UserNav({ user, isLoading = false }: UserNavProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Handling hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-24" />
      </div>
    );
  }

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" passHref>
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex"
            onClick={() => signIn()}
          >
            Sign In
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => signIn()}
          aria-label="Sign In"
        >
          <UserCircle2 className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  const userInitial = user.name?.charAt(0) || user.email?.charAt(0) || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative flex items-center gap-2 rounded-full p-1 sm:pl-3 sm:pr-2 focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <Avatar className="h-8 w-8 border">
            {user.image ? (
              <AvatarImage
                src={user.image}
                alt={user.name || "User avatar"}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary">
              {userInitial.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium truncate max-w-[100px]">
            {user.name?.split(" ")[0] || user.email?.split("@")[0] || "User"}
          </span>
          <ChevronDown className="hidden sm:inline h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-1 p-2" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-1">
            {user.name && (
              <p className="text-sm font-medium leading-none">{user.name}</p>
            )}
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="flex cursor-pointer items-center gap-2 rounded-md"
            >
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="flex cursor-pointer items-center gap-2 rounded-md"
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-destructive focus:bg-destructive/10 rounded-md"
          onSelect={async (event) => {
            event.preventDefault();
            await signOut({ redirect: false });
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserNav;
