import { auth } from "@/auth";
import { redirect } from "next/navigation";
//import { logActivity } from "@/lib/activityLogger";
import NotificationsComponent from "@/components/notifications/NotificationsComponent";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <NotificationsComponent />
    </div>
  );
}
