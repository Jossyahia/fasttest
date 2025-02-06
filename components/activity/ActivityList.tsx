import { Activity } from "@prisma/client";

interface ActivityListProps {
  initialData: Activity[]; // Changed from 'activities' to 'initialData' to match usage
}

export default function ActivityList({ initialData }: ActivityListProps) {
  return (
    <div className="space-y-4">
      {initialData.map((activity) => (
        <div key={activity.id} className="p-4 border rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">
            {new Date(activity.createdAt).toLocaleString()}
          </p>
          <p className="font-semibold">{activity.action}</p>
          {activity.details && (
            <p className="text-gray-700">{activity.details}</p>
          )}
        </div>
      ))}
    </div>
  );
}
