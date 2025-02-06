// app/(protected)/profile/components/NotificationPreferences.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Switch } from "@/components/ui/switch";

const notificationSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  lowStock: z.boolean(),
  orderUpdates: z.boolean(),
  activityAlerts: z.boolean(),
  securityAlerts: z.boolean(),
});

type NotificationPreferencesData = z.infer<typeof notificationSchema>;

export function NotificationPreferences() {
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, watch, setValue } =
    useForm<NotificationPreferencesData>({
      resolver: zodResolver(notificationSchema),
      defaultValues: {
        email: true,
        push: true,
        lowStock: true,
        orderUpdates: true,
        activityAlerts: true,
        securityAlerts: true,
      },
    });

  const onSubmit = async (data: NotificationPreferencesData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update preferences");
      toast.success("Notification preferences updated");
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      toast.error("Failed to update preferences");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            {
              id: "email",
              label: "Email Notifications",
              description: "Receive notifications via email",
            },
            {
              id: "push",
              label: "Push Notifications",
              description: "Receive push notifications in browser",
            },
            {
              id: "lowStock",
              label: "Low Stock Alerts",
              description: "Get notified when products are running low",
            },
            {
              id: "orderUpdates",
              label: "Order Updates",
              description: "Receive updates about order status changes",
            },
            {
              id: "activityAlerts",
              label: "Activity Alerts",
              description: "Get notified about important account activities",
            },
            {
              id: "securityAlerts",
              label: "Security Alerts",
              description: "Receive security-related notifications",
            },
          ].map(({ id, label, description }) => (
            <div key={id} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
              <Switch
                checked={watch(id as keyof NotificationPreferencesData)}
                onCheckedChange={(checked) =>
                  setValue(id as keyof NotificationPreferencesData, checked)
                }
              />
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
