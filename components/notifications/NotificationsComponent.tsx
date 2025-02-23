"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  read: boolean;
  createdAt: Date;
  activity: {
    action: string;
    details: string | null;
  };
}

export default function NotificationsComponent() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ notificationIds: [notificationId] }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchNotifications();

      // Set up polling for new notifications
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [session]);

  if (loading) {
    return <div className="p-4 text-center">Loading notifications...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No notifications
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-4 p-4 hover:bg-muted/50 ${
            !notification.read ? "bg-muted/20" : ""
          }`}
        >
          <Bell className="h-5 w-5 mt-1 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {notification.activity.action}
            </p>
            {notification.activity.details && (
              <p className="text-sm text-muted-foreground">
                {notification.activity.details}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {format(new Date(notification.createdAt), "PPp")}
            </p>
          </div>
          {!notification.read && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto flex-shrink-0"
              onClick={() => markAsRead(notification.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
