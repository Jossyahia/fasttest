// app/vendors/not-found.jsx
import Link from "next/link";

export default function VendorNotFound() {
  return (
    <div className="container mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Vendor Not Found</h1>
      <p className="mt-2 text-center text-gray-600">
        The vendor you are looking for doesn't exist or you don't have
        permission to view it.
      </p>
      <div className="mt-6 flex gap-4">
        <Link
          href="/vendors"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          View All Vendors
        </Link>
        <Link
          href="/vendors/new"
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Add New Vendor
        </Link>
      </div>
    </div>
  );
}
