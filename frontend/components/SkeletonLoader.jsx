export default function SkeletonLoader() {
  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="animate-pulse">
        <div className="bg-gray-200 h-10 w-full"></div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border-t border-gray-200">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  )
}