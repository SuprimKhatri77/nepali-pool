export function StudentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
      {/* Header with avatar and name */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar skeleton */}
        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>

        <div className="flex-1 min-w-0">
          {/* Name skeleton */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

          {/* Location skeleton */}
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>

          {/* Status badge skeleton */}
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      {/* Details section */}
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-3 mt-4">
        <div className="h-10 bg-gray-200 rounded flex-1"></div>
        <div className="h-10 bg-gray-200 rounded flex-1"></div>
      </div>
    </div>
  );
}
