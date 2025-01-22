// components/users/UserActions.tsx
"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash, Mail } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { EditUserDialog } from "./EditUserDialog";
import { toast } from "react-hot-toast";
import { User } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const queryClient = useQueryClient();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const deleteUser = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to delete user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
      setShowDeleteAlert(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
      setShowDeleteAlert(false);
    },
  });

  const resendVerification = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${user.id}/verify`, {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to resend verification");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Verification email sent");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send verification email");
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </DropdownMenuItem>
          {!user.emailVerified && (
            <DropdownMenuItem
              onClick={() => resendVerification.mutate()}
              disabled={resendVerification.isPending}
            >
              <Mail className="mr-2 h-4 w-4" />
              Resend Verification
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setShowDeleteAlert(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        user={user}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUser.mutate()}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
