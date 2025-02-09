"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";

const orderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be non-negative"),
});

const orderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  paymentType: z.enum(["PREPAID", "PAY_ON_DELIVERY", "CREDIT"], {
    required_error: "Payment type is required",
  }),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
}

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

export default function AddOrderModal({ isOpen, onClose }: AddOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const { data: customers } = useQuery<{
    customers: Customer[];
  }>({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");
      return response.json();
    },
  });

  const { data: products } = useQuery<{
    products: Product[];
  }>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/inventory");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentType: "PREPAID",
      items: [{ productId: "", quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const selectedCustomerId = watch("customerId");
  const watchItems = watch("items");

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const customer = customers?.customers.find(
      (c) => c.id === selectedCustomerId
    );
    if (customer) {
      setValue("shippingAddress", customer.address);
    }
  }, [selectedCustomerId, customers, setValue]);

  useEffect(() => {
    watchItems.forEach((item, index) => {
      const product = products?.products.find((p) => p.id === item.productId);
      if (product && (!item.price || item.price === 0)) {
        setValue(`items.${index}.price`, product.price);
      }
    });
  }, [watchItems, products, setValue]);

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-semibold">
            Create New Order
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="customerId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer
            </label>
            <select
              id="customerId"
              {...register("customerId")}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-invalid={!!errors.customerId}
              aria-describedby="customer-error"
            >
              <option value="">Select Customer</option>
              {customers?.customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p
                id="customer-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.customerId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="paymentType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Payment Type
            </label>
            <select
              id="paymentType"
              {...register("paymentType")}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-invalid={!!errors.paymentType}
            >
              <option value="PREPAID">Prepaid</option>
              <option value="PAY_ON_DELIVERY">Pay on Delivery</option>
              <option value="CREDIT">Credit</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Order Items</h3>
              <button
                type="button"
                onClick={() => {
                  append({ productId: "", quantity: 1, price: 0 });
                  setTimeout(() => {
                    const newItemIndex = fields.length;
                    const newSelect = document.querySelector(
                      `[name="items.${newItemIndex}.productId"]`
                    );
                    if (newSelect instanceof HTMLElement) newSelect.focus();
                  }, 100);
                }}
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" aria-hidden="true" /> Add Item
              </button>
            </div>

            {fields.map((field, index) => (
              <fieldset
                key={field.id}
                className="flex flex-col sm:flex-row gap-4 items-start bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex-1 w-full">
                  <select
                    {...register(`items.${index}.productId`)}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label={`Product ${index + 1}`}
                  >
                    <option value="">Select Product</option>
                    {products?.products.map((product) => (
                      <option
                        key={product.id}
                        value={product.id}
                        disabled={product.quantity === 0}
                        className={
                          product.quantity === 0 ? "text-gray-400" : ""
                        }
                      >
                        {product.name} (${product.price}) - {product.quantity}{" "}
                        in stock
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-24">
                  <input
                    type="number"
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                      min: 1,
                      max: products?.products.find(
                        (p) => p.id === watchItems[index]?.productId
                      )?.quantity,
                    })}
                    placeholder="Qty"
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label={`Quantity for item ${index + 1}`}
                  />
                </div>

                <div className="w-full sm:w-32">
                  <input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    placeholder="Price"
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label={`Price for item ${index + 1}`}
                  />
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700 self-center"
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </fieldset>
            ))}
            {errors.items && (
              <p className="text-red-500 text-sm" role="alert">
                {errors.items.message}
              </p>
            )}
          </div>

          <div
            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}
          >
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="paymentStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                {...register("paymentStatus")}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="shippingAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Shipping Address
            </label>
            <textarea
              id="shippingAddress"
              {...register("shippingAddress")}
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-invalid={!!errors.shippingAddress}
            />
            {errors.shippingAddress && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {errors.shippingAddress.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              {...register("notes")}
              rows={2}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto"
            >
              {isSubmitting ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
