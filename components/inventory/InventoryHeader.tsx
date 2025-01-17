"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddProductModal from "./AddProductModal";

export default function InventoryHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">Inventory Management</h1>
        <p className="text-gray-600">Manage your products and stock levels</p>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Product
      </button>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
