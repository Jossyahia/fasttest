import { Metadata } from "next";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import SalesChart from "@/components/dashboard/SalesChart";
import InventoryList from "@/components/inventory/InventoryList";

export const metadata: Metadata = {
  title: "Dashboard | Inventory System",
  description: "Inventory management system dashboard",
};

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentOrders />
        <LowStockAlert />
      </div>
      {/* <InventoryList /> */}
     {/* {/ **<SalesChart />//**} */}
    </div>
  );
}
