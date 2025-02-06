"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Activity as ActivityIcon } from "lucide-react";

interface ActivityListProps {
  initialData?: Activity[];
}

async function getActivities(): Promise<Activity[]> {
  const response = await fetch("/api/activities", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Failed to fetch:", response.status, response.statusText);
    throw new Error("Failed to fetch activities");
  }
  return response.json();
}

export function ActivityList({ initialData }: ActivityListProps) {
  const {
    data: activities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
    initialData: initialData, // Use the initialData prop here
  });

  if (isLoading && !initialData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading activities</p>
      </div>
    );
  }

  if (!activities?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <ActivityIcon className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No activities found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-4 p-4 rounded-lg border bg-card"
        >
          <div className="flex-1">
            <p className="font-medium">{activity.action}</p>
            {activity.details && (
              <p className="text-sm text-muted-foreground mt-1">
                {activity.details}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(activity.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
