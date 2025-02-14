interface Activity {
  id: string;
  action: string;
  details?: string | null;
  createdAt: Date;
  userId: string;
}

interface ActivityListProps {
  initialData: Activity[];
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
