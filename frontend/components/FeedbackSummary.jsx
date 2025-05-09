'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function FeedbackSummary({ summaryData }) {
  if (!summaryData) return null;
  
  const getSentimentClass = (score) => {
    if (score > 0.2) return 'text-green-600';
    if (score < -0.2) return 'text-red-600';
    return 'text-yellow-600';
  };
  
  const getSentimentText = (score) => {
    if (score > 0.2) return 'Positive';
    if (score < -0.2) return 'Negative';
    return 'Neutral';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">AI-Generated Feedback Summary</h2>
        
        {/* Key metrics at the top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border border-blue-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Feedback</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{summaryData.totalFeedback}</p>
              </div>
              <div className="bg-blue-200 rounded-full p-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm border border-green-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-600 text-sm font-medium">Average Rating</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-3xl font-bold text-green-900">
                    {summaryData.averageRating ? summaryData.averageRating.toFixed(1) : 'N/A'}
                  </p>
                  {summaryData.averageRating && (
                    <p className="text-green-600 ml-1">/5</p>
                  )}
                </div>
              </div>
              <div className="bg-green-200 rounded-full p-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm border border-purple-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-600 text-sm font-medium">Sentiment</p>
                <p className={`text-3xl font-bold ${getSentimentClass(summaryData.avgSentiment)} mt-1`}>
                  {getSentimentText(summaryData.avgSentiment)}
                </p>
              </div>
              <div className="bg-purple-200 rounded-full p-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top themes */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Top Themes</h3>
          <div className="flex flex-wrap gap-3">
            {summaryData.topThemes && summaryData.topThemes.map((theme, index) => (
              <div key={index} className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-medium text-sm flex items-center">
                {theme[0]}
                <span className="ml-2 bg-blue-200 text-blue-700 rounded-full text-xs px-2 py-0.5">{theme[1]}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sample feedback */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Sample Feedback</h3>
          <div className="space-y-4">
            {summaryData.sampleFeedback && summaryData.sampleFeedback.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full text-gray-800">
                      ID: {item.CustomerID}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full text-gray-800 ml-2">
                      {item.Date}
                    </span>
                  </div>
                  {item.Rating !== undefined && (
                    <div className={`text-white px-3 py-1 rounded-full text-xs font-medium ${
                      item.Rating >= 4 ? 'bg-green-500' : 
                      item.Rating >= 3 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}>
                      {item.Rating}/5
                    </div>
                  )}
                </div>
                {item.Product && item.Category && (
                  <p className="text-sm font-medium mt-2 text-gray-700">
                    {item.Product} - {item.Category}
                  </p>
                )}
                <p className="mt-2 text-gray-700">"{item.FeedbackText}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}