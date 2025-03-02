import Link from "next/link";
import { FaMapMarkerAlt, FaCalendar } from "react-icons/fa";

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  quantity: number;
  minStock: number;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Vendor {
  id: string;
  name: string;
  location?: string | null;
  createdAt: Date; // Updated to Date
  products?: (Product | null)[];
}

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {vendor.products?.length || 0} Products
        </span>
      </div>

      {vendor.location && (
        <div className="mb-3 flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          <span>{vendor.location}</span>
        </div>
      )}

      <div className="mb-4 flex items-center text-sm text-gray-600">
        <FaCalendar className="mr-2 text-gray-400" />
        <span>Added {new Date(vendor.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Link
          href={`/vendors/${vendor.id}`}
          className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          View Details
        </Link>
        <Link
          href={`/vendors/${vendor.id}/edit`}
          className="rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
