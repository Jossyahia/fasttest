// components/customers/CustomerList.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Edit, Trash2, User } from "lucide-react";
import EditCustomerModal from "./EditCustomerModal";
import { CustomerListSkeleton } from "./CustomerListSkeleton";
import { Customer } from "@/types/customer"; // Import the shared Customer type

export default function CustomerList() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      return response.json();
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await fetch(`/api/customers/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete customer");
        }
        // Refresh the customer list
        window.location.reload();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  if (isLoading) {
    return <CustomerListSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.customers.map((customer: Customer) => (
            <tr key={customer.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <User className="h-10 w-10 rounded-full bg-gray-100 p-2" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{customer.email}</div>
                <div className="text-sm text-gray-500">{customer.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {customer.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {customer.address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsEditModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCustomer && (
        <EditCustomerModal
          customer={selectedCustomer}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
}
