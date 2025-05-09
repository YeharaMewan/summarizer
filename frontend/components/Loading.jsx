export default function Loading() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-200 animate-spin animate-pulse opacity-70"></div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-gray-700">AI is analyzing your feedback...</p>
          <p className="text-sm text-gray-500 mt-2">Identifying patterns, sentiment, and key insights</p>
        </div>
        
        <div className="mt-8 w-64 bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center">
            <div className="text-xs font-medium text-gray-500">Analyzing</div>
            <div className="w-8 h-8 border-2 border-blue-500 border-dashed rounded-full animate-spin mt-1"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs font-medium text-gray-500">Processing</div>
            <div className="w-8 h-8 border-2 border-green-500 border-dashed rounded-full animate-spin mt-1" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs font-medium text-gray-500">Summarizing</div>
            <div className="w-8 h-8 border-2 border-purple-500 border-dashed rounded-full animate-spin mt-1" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}