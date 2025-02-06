"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NotificationSkeleton from "./NotificationSkeleton";

interface Notification {
  id: string;
  action: string;
  details?: string;
  createdAt: string;
}

const NotificationsComponent = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session) return;

      try {
        setIsLoading(true);
        const response = await fetch("/api/notifications");

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [session]);

  if (isLoading) return <NotificationSkeleton />;

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {notification.action}
                </h3>
                {notification.details && (
                  <p className="text-gray-600 text-sm mt-1">
                    {notification.details}
                  </p>
                )}
                <span className="text-xs text-gray-500 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsComponent;
