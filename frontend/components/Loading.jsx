export default function Loading() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-200 animate-spin-slow"></div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700">Generating AI Summary...</p>
        <p className="text-sm text-gray-500 mt-2">Analyzing feedback patterns and insights</p>
        
        <div className="mt-8 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  )
}