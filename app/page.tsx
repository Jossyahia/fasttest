"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChartBar, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// Types
interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

type BillingInterval = "monthly" | "yearly";

// Constants
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
  },
];

const features: Feature[] = [
  {
    icon: ChartBar,
    title: "Real-time Analytics",
    description:
      "Get instant insights into inventory levels, trends, and forecasting with our powerful analytics dashboard.",
  },
  {
    icon: Clock,
    title: "Smart Reordering",
    description:
      "Automated reorder suggestions based on historical data and machine learning predictions.",
  },
  {
    icon: Zap,
    title: "Quick Integration",
    description:
      "Connect with your existing systems in minutes with our pre-built integrations and API.",
  },
];

const FeatureCard = ({ feature }: { feature: Feature }) => (
  <div className="group p-6 rounded-lg border hover:border-primary transition-colors">
    <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
    <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
    <p className="text-muted-foreground">{feature.description}</p>
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
        "relative hover:shadow-lg transition-shadow",
        plan.popular &&
          "border-primary shadow-lg scale-105 md:scale-100 md:hover:scale-105"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground">/{billingInterval}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
        <Button className="w-full mb-6 hover:scale-105 transition-transform">
          Get started
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container px-4 py-16 md:py-24 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up">
              Inventory management,{" "}
              <span className="text-primary">simplified</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Track, manage, and optimize your inventory with powerful
              automation and real-time insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto hover:scale-105 transition-transform"
              >
                Start free trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto hover:scale-105 transition-transform"
              >
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container px-4 py-16 md:py-24 mx-auto">
          <div className="max-w-xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <div className="inline-flex items-center rounded-lg border p-1">
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

      <footer className="border-t">
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
