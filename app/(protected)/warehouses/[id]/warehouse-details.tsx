// app/(protected)/warehouses/[id]/warehouse-details.tsx
import { Warehouse } from "@prisma/client";
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
          <Link href={`/warehouses/${warehouse.id}/products/new`}>
            <Button>Add Product</Button>
          </Link>
        </div>

        {warehouse.products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {warehouse.products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.sku}</CardDescription>
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
    </div>
  );
}
