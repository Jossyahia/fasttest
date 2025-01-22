// components/users/UsersListSkeleton.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Changed to named export
export function UsersListSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
