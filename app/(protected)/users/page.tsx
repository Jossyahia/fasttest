// app/(protected)/users/page.tsx
import { Suspense } from "react";
import { UsersList } from "@/components/users/UsersList";
import { UsersListSkeleton } from "@/components/users/UsersListSkeleton";
import { CreateUser } from "@/components/users/CreateUser";
import { Providers } from "@/components/providers/providers";


export default function UsersPage() {
  return (
    <Providers>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">
              Manage organization users and their roles
            </p>
          </div>
          <CreateUser />
        </div>

        <Suspense fallback={<UsersListSkeleton />}>
          <UsersList />
        </Suspense>
      </div>
    </Providers>
  );
}
