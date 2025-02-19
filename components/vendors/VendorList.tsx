"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VendorCard from "@/components/vendors/VendorCard";
import { FaSearch, FaPlus } from "react-icons/fa";
import { Vendor } from "@/app/(protected)/vendors/page";

interface VendorListProps {
  initialVendors: Vendor[];
}

export default function VendorList({ initialVendors }: VendorListProps) {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchVendors = async () => {
      if (searchTerm.trim().length === 0) {
        setVendors(initialVendors);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/vendors?name=${encodeURIComponent(searchTerm)}`
        );
        if (response.ok) {
          const data: Vendor[] = await response.json();
          setVendors(data);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchVendors, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, initialVendors]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        <button
          onClick={() => router.push("/vendors/new")}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Add Vendor
        </button>
      </div>

      <div className="mb-6 flex w-full items-center rounded-md border border-gray-300 bg-white px-3 py-2">
        <FaSearch className="mr-2 text-gray-400" />
        <input
          type="text"
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border-0 focus:outline-none focus:ring-0"
        />
      </div>

      {isLoading ? (
        <div className="mt-8 text-center text-gray-500">Loading vendors...</div>
      ) : vendors.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-md bg-gray-50 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900">
            No vendors found
          </h3>
          <p className="mt-2 text-gray-600">
            {searchTerm
              ? `No vendors matching "${searchTerm}"`
              : "Get started by adding your first vendor"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => router.push("/vendors/new")}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Vendor
            </button>
          )}
        </div>
      )}
    </div>
  );
}
