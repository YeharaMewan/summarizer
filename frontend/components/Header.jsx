export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">ERP Customer Feedback Summarizer</h1>
        <div className="flex items-center mt-2">
          <svg className="w-5 h-5 mr-2 text-blue-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <p className="text-blue-100">AI-powered insights from customer feedback</p>
        </div>
      </div>
    </header>
  )
}