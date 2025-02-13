export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full p-8">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200">
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
