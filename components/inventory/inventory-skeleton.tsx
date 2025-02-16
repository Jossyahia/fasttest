import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InventoryTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory List</CardTitle>
        <Skeleton className="h-4 w-[250px] mt-2" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 w-full md:w-[300px]" />
          <Skeleton className="h-10 w-full md:w-[180px]" />
        </div>

        <div className="rounded-md border">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[80px] hidden sm:block" />
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-5 w-[200px] hidden md:block" />
              <Skeleton className="h-5 w-[24px] ml-auto" />
            </div>

            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-4 pt-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-4 w-[70px] hidden sm:block" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[160px] hidden md:block" />
                  <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-4 w-[200px] hidden sm:block" />
          <div className="flex items-center gap-2 ml-auto">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
