// components/orders/OrderDetailsModal.tsx
"use client";

import { format } from "date-fns";

interface OrderItem {
  id: string;
  productId: string;
  product: {
    name: string;
    sku: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  total: number;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
}

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
  if (!isOpen) return null;

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Order Details #{order.id.slice(-6)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Order Status and Date */}
          <div className="flex justify-between items-center">
            <div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(order.createdAt), "PPpp")}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Customer Information
            </h3>
            <div className="text-gray-900">
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-gray-600">{order.customer.email}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Shipping Address
            </h3>
            <p className="text-gray-900 whitespace-pre-line">
              {order.shippingAddress}
            </p>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Order Items
            </h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.product.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {item.product.sku}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-3 text-sm font-medium text-gray-900 text-right"
                    >
                      Total
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
              <p className="text-gray-900 whitespace-pre-line">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
