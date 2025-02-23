// app/(protected)/settings/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/settings-form";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const settings = await prisma.settings.findFirst({
    where: {
      organization: {
        users: {
          some: {
            email: session?.user?.email || "",
          },
        },
      },
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your organization settings and preferences
          </p>
        </div>
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
