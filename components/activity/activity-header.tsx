// app/activities/components/activity-header.tsx
export function ActivityHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity Log</h1>
        <p className="text-sm text-muted-foreground">
          View all system activities and user actions
        </p>
      </div>
    </div>
  );
}
