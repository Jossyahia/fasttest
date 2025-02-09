"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";

const notificationSchema = z.object({
  email: z.object({
    orderUpdates: z.boolean(),
    inventory: z.boolean(),
    security: z.boolean(),
    marketing: z.boolean(),
  }),
  push: z.object({
    orderUpdates: z.boolean(),
    inventory: z.boolean(),
    security: z.boolean(),
  }),
  slack: z.object({
    enabled: z.boolean(),
    webhook: z.string().url().optional(),
  }),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export function NotificationSettings() {
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      email: {
        orderUpdates: true,
        inventory: true,
        security: true,
        marketing: false,
      },
      push: {
        orderUpdates: true,
        inventory: false,
        security: true,
      },
      slack: {
        enabled: false,
        webhook: "",
      },
    },
  });

  async function onSubmit(data: NotificationFormValues) {
    try {
      const response = await fetch("/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update notifications");
      toast.success("Notification settings updated");
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      toast.error("Failed to update notification settings");
    }
  }

  // Explicitly type the email settings keys as literal types.
  const emailNotificationSettings: {
    id:
      | "email.orderUpdates"
      | "email.inventory"
      | "email.security"
      | "email.marketing";
    label: string;
  }[] = [
    { id: "email.orderUpdates", label: "Order Updates" },
    { id: "email.inventory", label: "Inventory Alerts" },
    { id: "email.security", label: "Security Alerts" },
    { id: "email.marketing", label: "Marketing Updates" },
  ];

  // Explicitly type the push settings keys as literal types.
  const pushNotificationSettings: {
    id: "push.orderUpdates" | "push.inventory" | "push.security";
    label: string;
  }[] = [
    { id: "push.orderUpdates", label: "Order Updates" },
    { id: "push.inventory", label: "Inventory Alerts" },
    { id: "push.security", label: "Security Alerts" },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <div className="space-y-4">
            {emailNotificationSettings.map(({ id, label }) => (
              <div key={id} className="flex items-center justify-between">
                <label className="text-sm font-medium">{label}</label>
                <Switch
                  {...form.register(id)}
                  checked={form.watch(id)}
                  onCheckedChange={(checked: boolean) =>
                    form.setValue(id, checked)
                  }
                  aria-label={`Toggle ${label}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Push Notifications</h3>
          <div className="space-y-4">
            {pushNotificationSettings.map(({ id, label }) => (
              <div key={id} className="flex items-center justify-between">
                <label className="text-sm font-medium">{label}</label>
                <Switch
                  {...form.register(id)}
                  checked={form.watch(id)}
                  onCheckedChange={(checked: boolean) =>
                    form.setValue(id, checked)
                  }
                  aria-label={`Toggle ${label}`}
                />
              </div>
            ))}
          </div>
        </div>

        <Button type="submit">Save Notification Settings</Button>
      </form>
    </Card>
  );
}
