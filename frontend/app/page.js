'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import Header from '../components/Header'
import DateRangePicker from '../components/DateRangePicker'
import FeedbackSummary from '../components/FeedbackSummary'
import FeedbackTable from '../components/FeedbackTable'
import FeedbackDashboard from '../components/FeedbackDashboard'
import Loading from '../components/Loading'
import SkeletonLoader from '../components/SkeletonLoader'

export default function Home() {
  const [feedbackData, setFeedbackData] = useState([])
  const [summaryData, setSummaryData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  })
  const [activeTab, setActiveTab] = useState('summary')
  const [error, setError] = useState(null)

  // Fetch all feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setFetchingData(true)
        const response = await axios.get('http://localhost:5000/api/feedback')
        setFeedbackData(response.data)
        setError(null)
      } catch (error) {
        console.error('Error fetching feedback data:', error)
        setError('Failed to load feedback data. Please check if the backend server is running.')
        toast.error('Failed to load feedback data')
      } finally {
        setFetchingData(false)
      }
    }

    fetchFeedback()
  }, [])

  // Generate summary with Gemini
  const generateSummary = async () => {
    if (dateRange.startDate && dateRange.endDate && new Date(dateRange.startDate) > new Date(dateRange.endDate)) {
      toast.error('Start date cannot be after end date')
      return
    }
    
    setLoading(true)
    setSummaryData(null)
    setError(null)
    
    try {
      const response = await axios.post('http://localhost:5000/api/analyze-feedback', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      })
      
      if (response.data.error) {
        throw new Error(response.data.error)
      }
      
      setSummaryData(response.data)
      toast.success('Feedback analysis complete!')
    } catch (error) {
      console.error('Error analyzing feedback:', error)
      setError('Error analyzing feedback. Please try again or check if the Gemini API key is valid.')
      toast.error('Failed to analyze feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 mt-8 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Feedback Analysis Tool</h2>
          
          <DateRangePicker 
            dateRange={dateRange} 
            setDateRange={setDateRange} 
          />
          
          <button
            onClick={generateSummary}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || fetchingData}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 3.99998H6.8C5.11984 3.99998 4.27976 3.99998 3.63803 4.32696C3.07354 4.61458 2.6146 5.07353 2.32698 5.63801C2 6.27975 2 7.11983 2 8.79998V15.2C2 16.8801 2 17.7202 2.32698 18.362C2.6146 18.9264 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9264 21.673 18.362C22 17.7202 22 16.8801 22 15.2V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 5L14.9627 5.70867C14.3885 6.10211 14.1014 6.29883 13.8479 6.53161C13.6296 6.73534 13.4365 6.96415 13.2725 7.21373C13.0844 7.49683 12.945 7.81691 12.6663 8.45706L12 9.99998M18 3L9 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Summarize Feedback
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {loading && <Loading />}
        
        {summaryData && (
          <div className="mb-8 animate-fadeIn">
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-2 px-4 font-medium text-sm mr-4 border-b-2 transition-all duration-300 ${
                  activeTab === 'summary'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'
                }`}
              >
                AI Summary
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-4 font-medium text-sm border-b-2 transition-all duration-300 ${
                  activeTab === 'dashboard'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
            </div>
            
            {activeTab === 'summary' ? (
              <FeedbackSummary summaryData={summaryData} />
            ) : (
              <FeedbackDashboard summaryData={summaryData} />
            )}
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Feedback</h2>
          {fetchingData ? (
            <SkeletonLoader />
          ) : (
            <FeedbackTable data={feedbackData.slice(0, 10)} />
          )}
        </div>
      </div>
    </main>
  )
}