'use client'

export default function FeedbackSummary({ summaryData }) {
  if (!summaryData) return null
  
  // Split the summary into sections based on the numbered items
  // This helps with better formatting
  const parseSummary = (text) => {
    const sections = []
    let currentSection = ''
    
    text.split('\n').forEach(line => {
      // Check if line starts with a number followed by a period (like "1." or "2.")
      if (/^\d+\./.test(line.trim())) {
        if (currentSection) {
          sections.push(currentSection)
        }
        currentSection = line
      } else {
        currentSection += '\n' + line
      }
    })
    
    if (currentSection) {
      sections.push(currentSection)
    }
    
    return sections
  }
  
  const summaryParts = parseSummary(summaryData.summary)
  
  return (
    <div className="bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="prose max-w-none">
          <h3 className="text-lg font-medium text-gray-900 mb-4">AI-Generated Summary</h3>
          
          {/* Introduction part - likely before the numbered sections */}
          {summaryParts.length > 0 && !summaryParts[0].trim().startsWith('1.') && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
              <p className="text-blue-900">
                {summaryParts[0]}
              </p>
            </div>
          )}
          
          {/* Numbered sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {summaryParts
              .filter(part => /^\d+\./.test(part.trim()))
              .map((part, i) => (
                <div key={i} className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <p className="text-blue-900">
                    {part}
                  </p>
                </div>
              ))
            }
          </div>
          
          {/* Conclusion part - likely after the numbered sections */}
          {summaryParts.length > 1 && 
           !summaryParts[summaryParts.length - 1].trim().startsWith(/^\d+\./) && 
           summaryParts.some(part => /^\d+\./.test(part.trim())) && (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <p className="text-blue-900">
                {summaryParts[summaryParts.length - 1]}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Feedback Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md transition-transform duration-300 hover:scale-105">
              <div className="text-sm font-medium text-gray-500">Total Feedback</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">{summaryData.totalFeedback}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md transition-transform duration-300 hover:scale-105">
              <div className="text-sm font-medium text-gray-500">Average Rating</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                {summaryData.averageRating ? summaryData.averageRating.toFixed(1) : 'N/A'}
                {summaryData.averageRating && <span className="text-lg ml-1">/ 5</span>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sample Feedback Entries</h3>
          <div className="space-y-4">
            {summaryData.sampleFeedback && summaryData.sampleFeedback.map((item, index) => (
              <div 
                key={index} 
                className="border rounded-md p-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm text-gray-500">Customer {item.CustomerID}</span>
                    {item.Product && item.Category && (
                      <h4 className="font-medium">
                        {item.Product} - {item.Category}
                      </h4>
                    )}
                  </div>
                  {item.Rating !== undefined && (
                    <div className={`text-white px-2 py-1 rounded text-sm font-medium ${
                      item.Rating >= 4 ? 'bg-green-500' : 
                      item.Rating >= 3 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}>
                      Rating: {item.Rating}/5
                    </div>
                  )}
                </div>
                <p className="mt-2 text-gray-700">{item.FeedbackText}</p>
                <div className="mt-2 text-sm text-gray-500">{item.Date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}