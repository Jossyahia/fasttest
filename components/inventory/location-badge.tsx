"use client";

export function LocationBadge({ location }: { location: string | null }) {
  if (!location) {
    return <span className="text-sm text-gray-500">Not set</span>;
  }

  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
      {location}
    </span>
  );
}
