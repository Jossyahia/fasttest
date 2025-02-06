"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  action: string;
  details?: string;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(
          `/api/notifications?userId=${session.user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [session]);

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {notifications.length > 0 && (
        <span
          className={cn(
            "absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center",
            "rounded-full bg-red-500 text-white text-xs"
          )}
        >
          {notifications.length}
        </span>
      )}
    </div>
  );
}
