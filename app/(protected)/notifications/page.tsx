import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NotificationList } from "@/components/notifications/NotificationList";
import { Suspense } from "react";
import NotificationSkeleton from "@/components/notifications/NotificationSkeleton";

async function fetchNotifications(userId: string) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/notifications?userId=${userId}`,
    {
      next: { tags: ["notifications"] },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notifications = await fetchNotifications(session.user.id);

  return (
    <div className="container max-w-2xl py-8">
      <div className="bg-white rounded-lg shadow-sm border">
        <header className="p-6 border-b">
          <h1 className="text-2xl font-semibold">Notifications</h1>
        </header>

        <Suspense fallback={<NotificationSkeleton />}>
          <NotificationList notifications={notifications} isLoading={false} />
        </Suspense>
      </div>
    </div>
  );
}
