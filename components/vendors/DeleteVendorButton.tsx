"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface DeleteVendorButtonProps {
  vendorId: string;
  vendorName: string;
}

export default function DeleteVendorButton({
  vendorId,
  vendorName,
}: DeleteVendorButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete vendor");
      }

      toast.success("Vendor deleted successfully");
      setIsOpen(false);
      router.push("/vendors");
      router.refresh();
    } catch (error: unknown) {
      const errorMsg =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "An error occurred";
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        type="button"
      >
        Delete
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="delete-vendor-title"
          aria-describedby="delete-vendor-description"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3
              id="delete-vendor-title"
              className="text-lg font-semibold text-gray-900"
            >
              Delete Vendor
            </h3>
            <p id="delete-vendor-description" className="mt-2 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium">{vendorName}</span>? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
