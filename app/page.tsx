"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChartBar, Clock, Zap, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    description: "For small businesses",
    features: ["1,000 products", "Basic analytics", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    description: "For growing teams",
    features: [
      "10,000 products",
      "Advanced analytics",
      "Priority support",
      "API access",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    description: "For large organizations",
    features: [
      "Unlimited products",
      "Custom analytics",
      "24/7 support",
      "Custom integrations",
    ],
  },
];

const navigation = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
];

export default function LandingPage() {
  const [billingInterval, setBillingInterval] = useState("monthly");
  // Skip mobileMenuOpen since it's not used.
  const [, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-gray-950/80">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold text-xl">
              FastIv Pro
            </Link>
            <div className="hidden md:flex gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button className="hidden sm:inline-flex" size="sm">
              Get Started
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button className="mt-4">Get Started</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 py-16 md:py-24 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Inventory management,{" "}
              <span className="text-blue-500">simplified</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 px-4">
              Track, manage, and optimize your inventory with powerful
              automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button size="lg" className="w-full sm:w-auto">
                Start free trial
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container px-4 py-16 md:py-24 mx-auto"
        >
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <ChartBar className="h-8 w-8 text-blue-500" />
              <h3 className="text-xl font-semibold">Real-time Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get instant insights into inventory levels and trends.
              </p>
            </div>
            <div className="space-y-4">
              <Clock className="h-8 w-8 text-blue-500" />
              <h3 className="text-xl font-semibold">Smart Reordering</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automated suggestions based on historical data.
              </p>
            </div>
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <Zap className="h-8 w-8 text-blue-500" />
              <h3 className="text-xl font-semibold">Quick Integration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with your existing systems in minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container px-4 py-16 md:py-24 mx-auto">
          <div className="max-w-xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple pricing</h2>
            <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <Button
                variant={billingInterval === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingInterval("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={billingInterval === "yearly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingInterval("yearly")}
              >
                Yearly (-20%)
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const price =
                billingInterval === "yearly"
                  ? Math.floor(plan.price * 0.8)
                  : plan.price;

              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    plan.popular
                      ? "border-2 border-blue-500 shadow-lg"
                      : "border border-gray-200 dark:border-gray-800"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-3xl font-bold">${price}</span>
                      <span className="text-gray-500">/{billingInterval}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      {plan.description}
                    </p>
                    <Button className="w-full mb-6">Get started</Button>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-2 text-sm">
                          <Check className="h-4 w-4 shrink-0 text-blue-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2025 FastIv Pro</p>
            <nav className="flex gap-6">
              <Link
                className="text-sm text-gray-500 hover:text-gray-900"
                href="#"
              >
                Terms
              </Link>
              <Link
                className="text-sm text-gray-500 hover:text-gray-900"
                href="#"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
