// app/(dashboard)/profile/loading.tsx
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";

export default function LoadingProfile() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Profile Settings</h1>
      <ProfileSkeleton />
    </div>
  );
}
