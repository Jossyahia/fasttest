// app/(protected)/settings/components/settings-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

const settingsFormSchema = z.object({
  siteName: z.string().min(2).max(50),
  siteUrl: z.string().url(),
  description: z.string().optional(),
  contactEmail: z.string().email(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      siteName: "",
      siteUrl: "",
      description: "",
      contactEmail: "",
    },
  });

  async function onSubmit(data: SettingsFormValues) {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update settings");
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      toast.error("Failed to update settings");
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Site Name</label>
          <Input {...form.register("siteName")} />
          {form.formState.errors.siteName && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.siteName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Site URL</label>
          <Input {...form.register("siteUrl")} />
          {form.formState.errors.siteUrl && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.siteUrl.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input {...form.register("description")} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Contact Email
          </label>
          <Input {...form.register("contactEmail")} />
          {form.formState.errors.contactEmail && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.contactEmail.message}
            </p>
          )}
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </Card>
  );
}
