"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChartBar,
  Clock,
  Zap,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  cta?: string;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
}

type BillingInterval = "monthly" | "yearly";

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for small businesses just starting out",
    features: [
      "Up to 20 products",
      "2 warehouses",
      "2 vendors",
      "Basic inventory tracking",
      "Email support",
      "Mobile app access",
    ],
    cta: "Get started",
  },
  {
    id: "starter",
    name: "Starter",
    price: 100,
    description: "For growing businesses that need more features",
    features: [
      "Up to 500 products",
      "5 warehouses",
      "10 vendors",
      "Basic inventory analytics",
      "Email support",
      "Basic reporting",
    ],
    cta: "Start free trial",
  },
  {
    id: "pro",
    name: "Pro",
    price: 200,
    description: "For growing businesses that need more power",
    features: [
      "Up to 10,000 products",
      "Unlimited warehouses",
      "Unlimited vendors",
      "Advanced analytics dashboard",
      "Priority email & chat support",
      "API access",
      "Multiple warehouse management",
      "Custom reporting",
    ],
    popular: true,
    cta: "Get started",
  },
];

const features: Feature[] = [
  {
    icon: ChartBar,
    title: "Real-time Analytics",
    description:
      "Get instant insights into inventory levels, trends, and forecasting with our powerful analytics dashboard.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "Smart Reordering",
    description:
      "Automated reorder suggestions based on historical data and machine learning predictions.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Quick Integration",
    description:
      "Connect with your existing systems in minutes with our pre-built integrations and API.",
    gradient: "from-amber-500 to-orange-500",
  },
];

const FeatureCard = ({ feature }: { feature: Feature }) => (
  <div className="group relative overflow-hidden rounded-2xl border bg-gradient-to-b from-background to-background/50 p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
    <div
      className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10 bg-gradient-to-br ${feature.gradient}`}
    />
    <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
    <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
    <p className="text-muted-foreground leading-relaxed">
      {feature.description}
    </p>
  </div>
);

const PricingCard = ({
  plan,
  billingInterval,
}: {
  plan: Plan;
  billingInterval: BillingInterval;
}) => {
  if (billingInterval === "yearly") {
    return (
      <Card
        className={cn(
          "relative transition-all duration-300 hover:shadow-xl",
          plan.popular &&
            "border-primary shadow-lg scale-[1.02] hover:scale-[1.03]"
        )}
      >
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
              <Sparkles className="h-3 w-3" /> Most Popular
            </span>
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex items-baseline gap-x-2">
            <span>{plan.name}</span>
          </CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            {plan.price === 0 ? (
              <span className="text-4xl font-bold">Free</span>
            ) : (
              <>
                <span className="text-4xl font-bold">
                  #{Math.floor(plan.price * 0.8)}
                </span>
                <span className="text-muted-foreground">/yearly</span>
              </>
            )}
            {plan.price > 0 && (
              <div className="mt-1 text-sm text-emerald-500 font-medium">
                Save 20% with yearly billing
              </div>
            )}
          </div>
          <Button
            className="w-full mb-6 group"
            variant={plan.popular ? "default" : "outline"}
            asChild
          >
            <Link href={plan.id === "free" ? "/register" : "/contact"}>
              <span>{plan.cta}</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <ul className="space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "relative transition-all duration-300 hover:shadow-xl",
        plan.popular &&
          "border-primary shadow-lg scale-[1.02] hover:scale-[1.03]"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            <Sparkles className="h-3 w-3" /> Most Popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-baseline gap-x-2">
          <span>{plan.name}</span>
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          {plan.price === 0 ? (
            <span className="text-4xl font-bold">Free</span>
          ) : (
            <>
              <span className="text-4xl font-bold">#{plan.price}</span>
              <span className="text-muted-foreground">/monthly</span>
            </>
          )}
        </div>
        <Button
          className="w-full mb-6 group"
          variant={plan.popular ? "default" : "outline"}
          asChild
        >
          <Link href={plan.id === "free" ? "/register" : "/contact"}>
            <span>{plan.cta}</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-2 text-sm">
              <Check className="h-4 w-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default function LandingPage() {
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("monthly");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background/50 to-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 py-16 md:py-28 lg:py-36 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-fade-up">
              Inventory management,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                simplified
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Track, manage, and optimize your inventory with powerful
              automation and real-time insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="group w-full sm:w-auto">
                  Start free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container px-4 py-16 md:py-24 mx-auto"
        >
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why choose FastIv Pro?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform is built with your business needs in mind
            </p>
          </div>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container px-4 py-16 md:py-28 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the plan that fits your business needs
            </p>
            <Tabs
              defaultValue="monthly"
              onValueChange={(value) =>
                setBillingInterval(value as BillingInterval)
              }
              className="inline-flex mt-4"
            >
              <TabsList className="grid w-full grid-cols-2 sm:w-64">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly (-20%)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                billingInterval={billingInterval}
              />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 border-y">
          <div className="container px-4 py-16 md:py-20 mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Ready to streamline your inventory management?
              </h2>
              <p className="text-muted-foreground text-lg">
                Get started today with our free plan. No credit card required.
              </p>
              <Button size="lg" asChild>
                <Link href="/register">
                  Start your free account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="font-semibold text-lg">FastIv Pro</p>
              <p className="text-sm text-muted-foreground">
                Modern inventory management solution
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 FastIv Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
