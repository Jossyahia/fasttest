// app/warehouses/create-warehouse-button.tsx(For Vendor)
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; // Changed this line

export function CreateWarehouseButton() {
  return (
    <Link href="/warehouses/new">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add Warehouse
      </Button>
    </Link>
  );
}
