"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Edit, Eye, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import EditOrderModal from "./EditOrderModal";
import OrderDetailsModal from "./OrderDetailsModal";
import { OrderListSkeleton } from "./OrderListSkeleton";
import { Order, OrderStatus, PaymentStatus } from "../../types/order";

export default function OrderList() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch orders
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
  });

  // Order update mutation
  const updateOrderMutation = useMutation({
    mutationFn: async (updatedOrder: Order) => {
      const response = await fetch(`/api/orders/${updatedOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: updatedOrder.customer.id,
          status: updatedOrder.status,
          paymentStatus: updatedOrder.paymentStatus,
          paymentType: updatedOrder.paymentType,
          items: updatedOrder.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: updatedOrder.shippingAddress,
          notes: updatedOrder.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update order");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Close the modal
      setIsEditModalOpen(false);
      setSelectedOrder(null);
    },
    onError: (error) => {
      console.error("Order update error:", error);
    },
  });

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-800",
      [OrderStatus.SHIPPED]: "bg-purple-100 text-purple-800",
      [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
      [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const colors = {
      [PaymentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [PaymentStatus.PAID]: "bg-green-100 text-green-800",
      [PaymentStatus.FAILED]: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  // Error handling
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        Failed to load orders: {error.message}
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <OrderListSkeleton />;
  }

  // No orders found
  if (!orders || orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-gray-500">
        No orders found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">
                      {order.orderNumber || order.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.customer.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(new Date(order.createdAt), {
                    addSuffix: true,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDetailsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsEditModalOpen(true);
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <>
          <EditOrderModal
            order={selectedOrder}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedOrder(null);
            }}
            onSave={(updatedOrder) => {
              updateOrderMutation.mutate(updatedOrder);
            }}
          />
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedOrder(null);
            }}
          />
        </>
      )}
    </div>
  );
}
