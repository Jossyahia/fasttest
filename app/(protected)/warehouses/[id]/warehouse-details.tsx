// app/warehouses/[id]/warehouse-details.tsx
import { Warehouse, Product } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WarehouseDetailsProps {
  warehouse: Warehouse & {
    products: Product[];
  };
}

export function WarehouseDetails({ warehouse }: WarehouseDetailsProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{warehouse.name}</h1>
        <div className="space-x-2">
          <Link href={`/warehouses/${warehouse.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Link href="/warehouses">
            <Button variant="ghost">Back to List</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>{warehouse.location}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Products</h3>
              {warehouse.products.length === 0 ? (
                <p className="text-muted-foreground">
                  No products in this warehouse
                </p>
              ) : (
                <ul className="divide-y">
                  {warehouse.products.map((product) => (
                    <li key={product.id} className="py-2">
                      <div className="flex justify-between">
                        <span>{product.name}</span>
                        <span className="text-muted-foreground">
                          SKU: {product.sku}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {product.quantity}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
