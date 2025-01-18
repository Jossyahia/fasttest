// app/reports/page.tsx
import { Metadata } from "next";
import ReportsDashboard from "@/components/reports/ReportsDashboard";

export const metadata: Metadata = {
  title: "Reports & Analytics",
  description: "View sales reports and analytics",
};

export default function ReportsPage() {
  return (
    <div className="p-6">
      <ReportsDashboard />
    </div>
  );
}
