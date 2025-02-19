// app/(protected)/warehouses/[id]/edit/warehouse-form.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createWarehouse, updateWarehouse } from "@/app/actions/warehouse";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Warehouse } from "@/types/warehouse";

interface WarehouseFormData {
  name: string;
  location: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface WarehouseFormProps {
  warehouse?: Warehouse;
}

export function WarehouseForm({ warehouse }: WarehouseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: warehouse?.name ?? "",
      location: warehouse?.location ?? "",
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        const warehouseData: WarehouseFormData = {
          name: values.name,
          location: values.location,
        };

        if (warehouse) {
          await updateWarehouse(warehouse.id, warehouseData);
        } else {
          await createWarehouse(warehouseData);
        }
        router.push("/warehouses");
        router.refresh();
      } catch (error) {
        console.error("Failed to save warehouse:", error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} value={field.value} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {warehouse ? "Update" : "Create"} Warehouse
        </Button>
      </form>
    </Form>
  );
}
