"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Order, OrderStatus, PaymentStatus, PaymentType } from "../../types/order";
import { XIcon } from "lucide-react";

const orderSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  paymentStatus: z.nativeEnum(PaymentStatus),
  paymentType: z.nativeEnum(PaymentType),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface EditOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedOrder: Order) => void;
}

export default function EditOrderModal({
  order,
  isOpen,
  onClose,
  onSave,
}: EditOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentType: order.paymentType || "PREPAID",
    },
  });

  useEffect(() => {
    if (isOpen) {
      initialFocusRef.current?.focus();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedOrder = {
        ...order,
        ...data,
      };
      onSave(updatedOrder);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the order"
      );
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-labelledby="edit-order-title"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 id="edit-order-title" className="text-xl font-semibold">
              Edit Order #{order.orderNumber}
            </h2>
            <button
              ref={initialFocusRef}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <XIcon className="h-5 w-5" />
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

          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-gray-600">Customer:</dt>
              <dd className="font-medium">{order.customer.name}</dd>
              <dt className="text-gray-600">Total:</dt>
              <dd className="font-medium">${order.total.toFixed(2)}</dd>
              <dt className="text-gray-600">Items:</dt>
              <dd className="font-medium">{order.items.length}</dd>
            </dl>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Order Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.status.message}
                </p>
              )}
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0) +
                      status.slice(1).toLowerCase().replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              {errors.paymentStatus && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.paymentStatus.message}
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {["PREPAID", "PAY_ON_DELIVERY", "CREDIT"].map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) +
                      type.slice(1).toLowerCase().replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              {errors.paymentType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.paymentType.message}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
