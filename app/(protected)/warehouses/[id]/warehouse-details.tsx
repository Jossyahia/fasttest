"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import ProductModal from "@/components/products/ProductModal";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface WarehouseDetailsProps {
  warehouse: Warehouse & {
    products: Array<{
      id: string;
      name: string;
      description: string | null;
      sku: string;
      quantity: number;
      status: string;
    }>;
  };
}

export function WarehouseDetails({ warehouse }: WarehouseDetailsProps) {
  const router = useRouter();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );
  //const [products, setProducts] = useState(warehouse.products);

  const handleOpenProductModal = (product?: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(undefined);
  };

  const handleProductUpdate = () => {
    // Refresh the current page to get updated data
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Warehouse Details</h2>
        <Link href={`/warehouses/${warehouse.id}/edit`}>
          <Button variant="outline">Edit Warehouse</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{warehouse.name}</CardTitle>
          <CardDescription>
            Created on {formatDate(warehouse.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-gray-500">Location</dt>
              <dd className="mt-1">{warehouse.location || "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1">{formatDate(warehouse.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Products</h3>
          <Button onClick={() => handleOpenProductModal()}>Add Product</Button>
        </div>

        {warehouse.products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {warehouse.products.map((product) => (
              <Card key={product.id} className="group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>{product.sku}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        handleOpenProductModal(product as unknown as Product)
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <dt className="font-medium text-gray-500">Quantity</dt>
                      <dd>{product.quantity}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">Status</dt>
                      <dd>{product.status}</dd>
                    </div>
                  </dl>
                  <p className="mt-2 text-sm text-gray-500">
                    {product.description || "No description available"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products in this warehouse yet.</p>
        )}
      </div>

      {/* Product Modal Integration */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        product={selectedProduct}
        onUpdate={handleProductUpdate}
      />
    </div>
  );
}
