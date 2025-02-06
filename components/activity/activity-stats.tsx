// components/activity/activity-stats.tsx
import { Activity } from "@prisma/client";

interface ActivityStatsProps {
  activities: Activity[];
}

export function ActivityStats({ activities }: ActivityStatsProps) {
  const totalActivities = activities.length;

  const uniqueUsers = new Set(activities.map((activity) => activity.userId))
    .size;

  const todayActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.createdAt);
    const today = new Date();
    return (
      activityDate.getDate() === today.getDate() &&
      activityDate.getMonth() === today.getMonth() &&
      activityDate.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard title="Total Activities" value={totalActivities} />
      <StatCard title="Active Users" value={uniqueUsers} />
      <StatCard title="Today's Activities" value={todayActivities} />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
