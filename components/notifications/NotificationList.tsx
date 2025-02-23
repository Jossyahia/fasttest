// components/notifications/NotificationList.tsx
import { Notification } from "@prisma/client";

interface NotificationListProps {
  notifications: Array<
    Notification & {
      activity: {
        action: string;
        details: string | null;
      };
    }
  >;
  isLoading: boolean;
}

export function NotificationList({
  notifications,
  isLoading,
}: NotificationListProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No notifications
      </div>
    );
  }

  return (
    <div className="divide-y">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-4 p-6 ${
            !notification.read ? "bg-muted/20" : ""
          }`}
        >
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">
              {notification.activity.action}
            </p>
            {notification.activity.details && (
              <p className="text-sm text-muted-foreground">
                {notification.activity.details}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {new Date(notification.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
