"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Settings as SettingsIcon, Save, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface Settings {
  id: string;
  lowStockThreshold: number;
  currency: string;
  notificationEmail: string | null;
  metadata: Record<string, unknown>;
}

const CURRENCIES = ["NGN", "USD", "EUR", "GBP"] as const;
type Currency = (typeof CURRENCIES)[number];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!session) return;

      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        const data: Settings = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        lowStockThreshold: parseInt(
          formData.get("lowStockThreshold") as string
        ),
        currency: formData.get("currency") as Currency,
        notificationEmail: formData.get("notificationEmail") as string,
        metadata: settings?.metadata,
      };

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      const updatedSettings: Settings = await response.json();
      setSettings(updatedSettings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 pb-4">
          <SettingsIcon className="h-8 w-8 text-muted-foreground" />
          <div>
            <CardTitle>Organization Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Low Stock Threshold</label>
              <Input
                name="lowStockThreshold"
                type="number"
                defaultValue={settings?.lowStockThreshold}
                min={1}
                required
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Receive alerts when product quantity falls below this number
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select name="currency" defaultValue={settings?.currency}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notification Email</label>
              <Input
                name="notificationEmail"
                type="email"
                defaultValue={settings?.notificationEmail || ""}
                placeholder="notifications@example.com"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Email address for system notifications and alerts
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Changes will be applied immediately across your organization
              </p>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
