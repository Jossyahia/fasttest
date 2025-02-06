// app/activities/page.tsx
import { ActivityChart } from "@/components/activity/activity-chart";
import { ActivityStats } from "@/components/activity/activity-stats";
import { ActivityList } from "@/components/activity/activity-list";
import { ActivityHeader } from "@/components/activity/activity-header";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ActivitiesPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const activities = await prisma.activity.findMany({
    where: {
      user: {
        organizationId: session.user.organizationId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto py-6">
      <ActivityHeader />
      <ActivityStats activities={activities} />
      <div className="grid gap-6 mb-6">
        <ActivityChart activities={activities} />
      </div>
      <ActivityList initialData={activities} />
    </div>
  );
}
