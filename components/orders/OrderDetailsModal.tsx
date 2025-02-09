import React from "react";
import { Order } from "../../types/order";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
            <h3 className="text-3xl font-semibold">
              Order Details {order.orderNumber}
            </h3>
            <button
              className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="relative flex-auto p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold">Customer Name:</p>
                <p>{order.customer.name}</p>
              </div>
              <div>
                <p className="font-bold">Customer Email:</p>
                <p>{order.customer.email}</p>
              </div>
              <div>
                <p className="font-bold">Order Status:</p>
                <p>{order.status}</p>
              </div>
              <div>
                <p className="font-bold">Payment Status:</p>
                <p>{order.paymentStatus}</p>
              </div>
              <div>
                <p className="font-bold">Total:</p>
                <p>${order.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="font-bold">Order Date:</p>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-xl font-semibold mb-4">Order Items</h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Product</th>
                    <th className="border p-2">SKU</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="border p-2">{item.product.name}</td>
                      <td className="border p-2">{item.product.sku}</td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
            <button
              className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-blue-500 rounded shadow hover:shadow-lg focus:outline-none"
              type="button"
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
