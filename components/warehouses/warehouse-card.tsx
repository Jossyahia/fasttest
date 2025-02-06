// components/warehouses/warehouse-card.tsx
"use client";

import Link from "next/link";
import { Warehouse } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WarehouseCardProps {
  warehouse: Warehouse;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export function WarehouseCard({
  warehouse,
  onDelete,
  disabled,
}: WarehouseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{warehouse.name}</CardTitle>
        <CardDescription>{warehouse.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Created: {new Date(warehouse.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Link href={`/warehouses/${warehouse.id}`} className="inline-block">
          <Button variant="outline" disabled={disabled}>
            View
          </Button>
        </Link>
        <Link
          href={`/warehouses/${warehouse.id}/edit`}
          className="inline-block"
        >
          <Button variant="outline" disabled={disabled}>
            Edit
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={disabled}>
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Warehouse</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this warehouse? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(warehouse.id)}
                disabled={disabled}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
