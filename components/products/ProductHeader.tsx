"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductModal from "./ProductModal";
import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
  onUpdate: () => Promise<void>;
}

export default function ProductHeader({ onUpdate }: ProductHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleProductUpdate = async () => {
    await onUpdate();
    // Force a client-side refresh
    router.refresh();
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Products</h1>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        Add Product
      </Button>
      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleProductUpdate}
        />
      )}
    </div>
  );
}
