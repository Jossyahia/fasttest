import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart2,
  Box,
  CheckCircle,
  Clock,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Streamline Your Inventory Management
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Effortlessly track, manage, and optimize your inventory with
                  our powerful and intuitive system.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register" passHref>
                  <Button>Get Started</Button>
                </Link>
                <Link href="/features" passHref>
                <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <BarChart2 className="h-12 w-12 mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Get instant insights into your inventory levels and trends.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Clock className="h-12 w-12 mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2">Automated Reordering</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Never run out of stock with smart reordering suggestions.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-12 w-12 mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2">Easy Integration</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Seamlessly connect with your existing systems and workflows.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              What Our Customers Say
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Customer"
                  className="rounded-full mb-4"
                  width={100}
                  height={100}
                />
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  "InventoryPro has revolutionized how we manage our stock. It's
                  intuitive and powerful."
                </p>
                <p className="font-bold">Jane Doe, CEO of TechCorp</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Customer"
                  className="rounded-full mb-4"
                  width={100}
                  height={100}
                />
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  "The real-time analytics have helped us make better decisions
                  and increase profitability."
                </p>
                <p className="font-bold">John Smith, Inventory Manager</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Customer"
                  className="rounded-full mb-4"
                  width={100}
                  height={100}
                />
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  "Customer support is top-notch. They're always there when we
                  need them."
                </p>
                <p className="font-bold">Emily Brown, Small Business Owner</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2025 FastIv Pro. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
