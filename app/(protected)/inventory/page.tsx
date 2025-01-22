import { Metadata } from "next";
import InventoryList from "@/components/inventory/InventoryList";
import InventoryHeader from "@/components/inventory/InventoryHeader";

export const metadata: Metadata = {
  title: "Inventory Management",
  description: "Manage your inventory items",
};

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <InventoryHeader />
      <InventoryList />
    </div>
  );
}
