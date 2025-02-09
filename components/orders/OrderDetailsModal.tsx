"use client";

import { useEffect, useRef } from "react";
import { Order } from "../../types/order";
import { XIcon } from "lucide-react";

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  const initialFocusRef = useRef<HTMLButtonElement>(null);

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-labelledby="order-details-title"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <div className="inline-block w-full max-w-4xl p-4 sm:p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 id="order-details-title" className="text-2xl font-semibold">
              Order Details #{order.orderNumber}
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

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <dt className="text-sm text-gray-600">Customer Name</dt>
                <dd className="font-medium">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Customer Email</dt>
                <dd className="font-medium">{order.customer.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Order Status</dt>
                <dd className="font-medium">{order.status}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Payment Status</dt>
                <dd className="font-medium">{order.paymentStatus}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Payment Type</dt>
                <dd className="font-medium">{order.paymentType}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Order Date</dt>
                <dd className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-medium text-gray-500"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-medium text-gray-500"
                      >
                        SKU
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-sm font-medium text-gray-500"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-sm font-medium text-gray-500"
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm">
                          {item.product.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {item.product.sku}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          ${item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-3 text-right font-medium"
                      >
                        Total:
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {order.notes && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-6 text-right">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
