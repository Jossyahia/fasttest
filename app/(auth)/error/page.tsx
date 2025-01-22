// app/auth/error/page.tsx
import { Card } from "@/components/ui/card";

interface ErrorPageProps {
  searchParams: { error?: string };
}

export default function ErrorPage({ searchParams }: ErrorPageProps) {
  const errorMessage =
    searchParams?.error || "An error occurred during authentication";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h1>
          <div className="mt-4">
            <p className="text-lg text-gray-600">{errorMessage}</p>
          </div>
          <div className="mt-6">
            <a
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Return to login
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
