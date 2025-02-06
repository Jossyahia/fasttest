// components/products/ProductTableSkeleton.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function ProductTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </CardTitle>
          <CardDescription>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "SKU",
                    "Name",
                    "Quantity",
                    "Status",
                    "Location",
                    "Actions",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-between items-center mt-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="flex space-x-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-10 bg-gray-200 rounded"
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
