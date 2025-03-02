// components/notifications/NotificationSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
