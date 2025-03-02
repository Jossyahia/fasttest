// components/notifications/bell.tsx
"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { useEffect } from "react";

export function NotificationBell() {
  const { notifications, mutate } = useNotifications();

  // Revalidate notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(mutate, 30000);
    return () => clearInterval(interval);
  }, [mutate]);

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="relative">
      <Bell
        className={cn(
          "h-6 w-6 transition-colors",
          unreadCount > 0 ? "text-red-500" : "text-gray-500"
        )}
      />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        </div>
      )}
    </div>
  );
}
