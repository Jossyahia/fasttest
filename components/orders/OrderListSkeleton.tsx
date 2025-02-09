export function OrderListSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      <div className="h-12 bg-gray-200"></div>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="h-16 border-b border-gray-200 flex items-center p-4"
        >
          <div className="h-8 w-8 bg-gray-300 rounded-full mr-4"></div>
          <div className="flex-grow">
            <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
            <div className="h-3 bg-gray-200 w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
