// components/users/UsersList.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { UserActions } from './UserActions'
import { UsersListSkeleton } from './UsersListSkeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserWithOrganization extends User {
  organization: {
    name: string
  }
}

interface UsersResponse {
  users: UserWithOrganization[]
}

const roleColors = {
  ADMIN: 'bg-red-100 text-red-800',
  MANAGER: 'bg-blue-100 text-blue-800',
  STAFF: 'bg-green-100 text-green-800',
  CUSTOMER: 'bg-gray-100 text-gray-800',
  PARTNER: 'bg-purple-100 text-purple-800',
}

export function UsersList() {
  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      return response.json()
    },
  })

  if (isLoading) {
    return <UsersListSkeleton />
  }

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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.image || ''} alt={user.name || ''} />
                    <AvatarFallback>
                      {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge className={roleColors[user.role]}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{user.organization.name}</TableCell>
              <TableCell>
                <Badge variant={user.emailVerified ? "success" : "warning"}>
                  {user.emailVerified ? "Verified" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <UserActions user={user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}