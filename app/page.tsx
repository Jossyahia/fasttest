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
import Link from "next/link"; // Add this import

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
    id: "starter",
    name: "Starter",
    price: 29,
    description: "Perfect for small businesses just getting started",
    features: [
      "Up to 1,000 products",
      "Basic inventory analytics",
      "Email support",
      "Mobile app access",
    ],
    cta: "Start free trial",
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    description: "For growing businesses that need more power",
    features: [
      "Up to 10,000 products",
      "Advanced analytics dashboard",
      "Priority email & chat support",
      "API access",
      "Multiple warehouse management",
      "Custom reporting",
    ],
    popular: true,
    cta: "Get started",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    description: "For large organizations with complex needs",
    features: [
      "Unlimited products",
      "Custom analytics solutions",
      "24/7 phone & email support",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced security features",
      "SLA guarantees",
    ],
    cta: "Contact sales",
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
  const price =
    billingInterval === "yearly" ? Math.floor(plan.price * 0.8) : plan.price;

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
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/{billingInterval}</span>
        </div>
        <Button
          className="w-full mb-6 group"
          variant={plan.popular ? "default" : "outline"}
        >
          <span>{plan.cta}</span>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
        <section className="container px-4 py-24 md:py-32 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-up">
              Inventory management,&nbsp;
              <span className="inline-flex bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                simplified
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Track, manage, and optimize your inventory with powerful
              automation and real-time insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="group">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  View demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container px-4 py-24 mx-auto">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container px-4 py-24 mx-auto">
          <div className="max-w-xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <Tabs
              defaultValue="monthly"
              onValueChange={(value) =>
                setBillingInterval(value as BillingInterval)
              }
              className="inline-flex"
            >
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly (-20%)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                billingInterval={billingInterval}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-background/50 backdrop-blur-sm">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 FastIv Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
