"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

// Define your organization schema.
const organizationSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Organization name must be at least 2 characters" }),
  taxId: z.string().optional(),
  industry: z.string().min(1, { message: "Industry is required" }),
  size: z.enum(["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"], {
    errorMap: () => ({ message: "Please select an organization size" }),
  }),
  address: z.object({
    street: z.string().min(1, { message: "Street address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    zipCode: z.string().min(1, { message: "ZIP code is required" }),
    country: z.string().min(1, { message: "Country is required" }),
  }),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

// Define a union type for the address field paths.
type AddressFieldPath = `address.${keyof OrganizationFormValues["address"]}`;

// Explicitly type the mapping array for address fields.
const addressFields: {
  name: keyof OrganizationFormValues["address"];
  label: string;
}[] = [
  { name: "street", label: "Street" },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "zipCode", label: "ZIP Code" },
  { name: "country", label: "Country" },
];

// Use named export instead of default export.
export function OrganizationSettings() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      taxId: "",
      industry: "",
      size: undefined,
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    },
  });

  async function onSubmit(data: OrganizationFormValues) {
    try {
      const response = await fetch("/api/settings/organization", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update organization");
      }

      toast.success("Organization settings updated successfully");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update organization settings");
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Organization Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Organization Name *
          </label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tax ID</label>
          <Input {...register("taxId")} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Industry *</label>
          <Input {...register("industry")} />
          {errors.industry && (
            <p className="text-sm text-red-500 mt-1">
              {errors.industry.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Organization Size *
          </label>
          <Select {...register("size")}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SMALL">Small (1-50 employees)</SelectItem>
              <SelectItem value="MEDIUM">Medium (51-200 employees)</SelectItem>
              <SelectItem value="LARGE">Large (201-1000 employees)</SelectItem>
              <SelectItem value="ENTERPRISE">
                Enterprise (1000+ employees)
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.size && (
            <p className="text-sm text-red-500 mt-1">{errors.size.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Address *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addressFields.map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1">
                  {label}
                </label>
                <Input {...register(`address.${name}` as AddressFieldPath)} />
                {errors.address?.[name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.address?.[name]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Save Organization Settings
        </Button>
      </form>
    </Card>
  );
}
