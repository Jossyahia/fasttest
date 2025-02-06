// app/components/profile/profile-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-10 w-full" />
          </div>
        </div>

        <div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-2 h-10 w-full" />
        </div>

        <div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-2 h-10 w-full" />
        </div>

        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-10 w-full" />
        </div>
      </div>

      <Skeleton className="h-10 w-full" />
    </div>
  );
}

