import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import AuthProvider from "@/components/providers/session-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { TopNav } from "@/components/layout/top-nav";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FastInv Pro",
  description:
    "Track, manage, and optimize your inventory with powerful automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            <div className="flex min-h-screen flex-col">
              <TopNav />
              <div className="flex-1 flex">
                <Sidebar />
                <main className="flex-1 p-6">
                  <Providers>{children}</Providers>
                </main>
              </div>
            </div>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
