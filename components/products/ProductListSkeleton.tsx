"use client";

const ProductListSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-2" />
      <div className="h-6 bg-gray-300 rounded w-full mb-2" />
      <div className="h-6 bg-gray-300 rounded w-5/6" />
    </div>
  );
};

export default ProductListSkeleton;
