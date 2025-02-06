"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  action: string;
  details?: string;
  createdAt: string;
}

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/notifications?userId=${session.user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [session]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading notifications...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No notifications</div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">{notification.action}</p>
              {notification.details && (
                <p className="text-xs text-gray-500 mt-1">
                  {notification.details}
                </p>
              )}
              <span className="text-xs text-gray-400 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
