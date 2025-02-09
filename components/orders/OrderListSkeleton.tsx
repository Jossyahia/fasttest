export function OrderListSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow animate-pulse">
      <div className="overflow-x-auto">
        <div className="hidden md:block">
          <div className="bg-gray-50 px-4 py-3">
            <div className="grid grid-cols-7 gap-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-4 py-4">
                <div className="grid grid-cols-7 gap-4">
                  {[...Array(7)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden space-y-4 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
