'use client'

import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

export default function FeedbackDocument({ summaryData }) {
  const printRef = useRef();
  
  if (!summaryData) return null;
  
  const handlePrint = () => {
    const content = printRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Feedback Analysis Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #333;
            }
            h1 {
              color: #1e3a8a;
              border-bottom: 2px solid #1e3a8a;
              padding-bottom: 10px;
            }
            h2 {
              color: #1e40af;
              margin-top: 1.5em;
            }
            p {
              margin-bottom: 1em;
            }
            .metadata {
              background-color: #f8fafc;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .theme-item {
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 10px;
              border: 1px solid #ddd;
              text-align: left;
            }
            th {
              background-color: #f8fafc;
            }
            .sentiment-positive {
              color: #10b981;
            }
            .sentiment-neutral {
              color: #f59e0b;
            }
            .sentiment-negative {
              color: #ef4444;
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };
  
  // Get sentiment class based on sentiment score
  const getSentimentClass = (score) => {
    if (score > 0.2) return 'text-green-600';
    if (score < -0.2) return 'text-red-600';
    return 'text-yellow-600';
  };
  
  // Get sentiment text based on sentiment score
  const getSentimentText = (score) => {
    if (score > 0.2) return 'Positive';
    if (score < -0.2) return 'Negative';
    return 'Neutral';
  };
  
  // Define CustomTooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-sm">
          <p className="font-medium text-gray-800">{`${label}`}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color || item.stroke || '#3b82f6' }} className="font-medium">
              {`${item.name}: ${item.value}${item.name === 'rating' ? '/5' : item.name === 'satisfactionRate' ? '%' : ''}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5H6C4.34315 5 3 6.34315 3 8V18C3 19.6569 4.34315 21 6 21H17C18.6569 21 20 19.6569 20 18V16.5M8 5V9C8 10.6569 9.34315 12 11 12H15.5M8 5H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 10V4M18.5 4L16 6.5M18.5 4L21 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Feedback Analysis Document
        </h3>
        <button 
          onClick={handlePrint}
          className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium text-sm shadow-sm hover:bg-blue-50 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
          </svg>
          Print Report
        </button>
      </div>
      
      <div className="p-6" ref={printRef}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">Customer Feedback Analysis Report</h1>
          <p className="text-gray-500 text-sm">
            Analysis Period: {summaryData.startDate || 'All time'} {summaryData.endDate ? `to ${summaryData.endDate}` : ''}
          </p>
        </div>
        
        {/* Metadata Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-blue-50 p-4 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-blue-700">Total Feedback</h3>
            <p className="text-2xl font-bold text-blue-900">{summaryData.totalFeedback}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-700">Average Rating</h3>
            <p className="text-2xl font-bold text-blue-900">
              {summaryData.averageRating ? summaryData.averageRating.toFixed(1) : 'N/A'}/5
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-700">Overall Sentiment</h3>
            <p className={`text-2xl font-bold ${getSentimentClass(summaryData.avgSentiment)}`}>
              {getSentimentText(summaryData.avgSentiment)}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({summaryData.avgSentiment.toFixed(2)})
              </span>
            </p>
          </div>
        </div>
        
        {/* Rating and Sentiment Distributions */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rating Distribution */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Rating Distribution</h3>
            <div className="space-y-3">
              {/* Make sure we show bars for ratings 1-5 even if there are no ratings for some values */}
              {[1, 2, 3, 4, 5].map(rating => {
                const count = summaryData.ratingDistribution && summaryData.ratingDistribution[rating] 
                  ? summaryData.ratingDistribution[rating] 
                  : 0;
                
                return (
                  <div key={rating} className="flex items-center">
                    <div className="w-10 text-gray-700 font-medium">{rating}/5</div>
                    <div className="flex-1 ml-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${rating >= 4 ? 'bg-green-500' : rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{width: `${(count / summaryData.totalFeedback) * 100 || 0}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-3 text-gray-500 text-sm">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Sentiment Distribution */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Sentiment Distribution</h3>
            <div className="space-y-3">
              {summaryData.sentimentDistribution && (
                <>
                  <div className="flex items-center">
                    <div className="w-16 text-green-600 font-medium">Positive</div>
                    <div className="flex-1 ml-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full bg-green-500"
                          style={{width: `${(summaryData.sentimentDistribution.positive / summaryData.totalFeedback) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-3 text-gray-500 text-sm">{summaryData.sentimentDistribution.positive}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 text-yellow-600 font-medium">Neutral</div>
                    <div className="flex-1 ml-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full bg-yellow-500"
                          style={{width: `${(summaryData.sentimentDistribution.neutral / summaryData.totalFeedback) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-3 text-gray-500 text-sm">{summaryData.sentimentDistribution.neutral}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 text-red-600 font-medium">Negative</div>
                    <div className="flex-1 ml-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full bg-red-500"
                          style={{width: `${(summaryData.sentimentDistribution.negative / summaryData.totalFeedback) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-3 text-gray-500 text-sm">{summaryData.sentimentDistribution.negative}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Trend Data Chart */}
        {summaryData.chartData && summaryData.chartData.trendData && summaryData.chartData.trendData.length > 0 && (
          <div className="mb-8 border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Rating & Satisfaction Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={summaryData.chartData.trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" domain={[0, 5]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="rating" name="Average Rating" stroke="#3b82f6" strokeWidth={2} dot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="satisfactionRate" name="Satisfaction Rate %" stroke="#10b981" strokeWidth={2} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Category Distribution if available */}
        {summaryData.categoryDistribution && Object.keys(summaryData.categoryDistribution).length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Feedback by Category</h3>
            <div className="border rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(summaryData.categoryDistribution).map(([category, count]) => (
                  <div key={category} className="flex items-center">
                    <div className="w-24 truncate text-gray-700 font-medium">{category}</div>
                    <div className="flex-1 ml-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full bg-blue-500"
                          style={{width: `${(count / summaryData.totalFeedback) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-3 text-gray-500 text-sm">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Top Themes Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Top Themes Identified</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summaryData.topThemes && summaryData.topThemes.map((theme, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800">{theme[0]}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {theme[1]} mentions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        
        
        {/* Summary Document */}
        <div className="text-gray-600 mt-8 prose max-w-none">
          <ReactMarkdown>{summaryData.summary}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}