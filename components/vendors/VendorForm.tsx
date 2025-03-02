"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Vendor {
  id: string;
  name: string;
  location: string | null;
}

interface VendorFormProps {
  initialData?: Partial<Vendor>;
}

export default function VendorForm({ initialData = {} }: VendorFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    location: initialData.location || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = initialData?.id
        ? `/api/vendors/${initialData.id}`
        : "/api/vendors";
      const method = initialData?.id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Something went wrong");
      }

      toast.success(initialData?.id ? "Vendor updated!" : "Vendor created!");
      router.push("/vendors");
      router.refresh();
    } catch (error: unknown) {
      const errorMsg =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "An error occurred";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Vendor Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter vendor name"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter vendor location"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : initialData?.id
            ? "Update Vendor"
            : "Create Vendor"}
        </button>
      </div>
    </form>
  );
}
