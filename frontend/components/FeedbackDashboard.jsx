'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function FeedbackDashboard({ summaryData }) {
  if (!summaryData || !summaryData.chartData) return null;
  
  const { 
    sentimentData, 
    ratingData, 
    categoryData, 
    trendData 
  } = summaryData.chartData;
  
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
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Feedback Analytics Dashboard</h2>
        
        {/* Key metrics */}
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
                <p className="text-purple-600 text-sm font-medium">Positive Sentiment</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">
                  {summaryData.sentimentDistribution && Math.round((summaryData.sentimentDistribution.positive / summaryData.totalFeedback) * 100)}%
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
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sentiment Distribution */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Sentiment Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Rating Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[1, 2, 3, 4, 5].map(rating => ({
                    name: String(rating),
                    value: summaryData.chartData.ratingData.find(item => item.name === String(rating))?.value || 0
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Category Distribution */}
          {categoryData && categoryData.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Feedback by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" name="Count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {/* Trend Data */}
          {trendData && trendData.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Rating & Satisfaction Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
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
        </div>
        
       {/* Key Insights Section */}
        <div className="mt-8 bg-indigo-50 p-6 rounded-xl border border-indigo-200">
          <h3 className="text-lg font-semibold mb-4 text-indigo-900 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Key Insights
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-indigo-800">
                {summaryData.avgSentiment > 0.2 
                  ? "Overall customer sentiment is positive, with most feedback showing satisfaction with the product."
                  : summaryData.avgSentiment < -0.2
                  ? "Customers are expressing significant concerns that need to be addressed promptly."
                  : "Customer sentiment is mixed, with both positive feedback and areas for improvement."}
              </span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <span className="text-indigo-800">
                {summaryData.topThemes && summaryData.topThemes.length > 0
                  ? `The most frequently mentioned theme is "${summaryData.topThemes[0][0]}" with ${summaryData.topThemes[0][1]} mentions.`
                  : "No clear themes were identified in the feedback analysis."}
              </span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-indigo-800">
                {summaryData.averageRating > 4
                  ? "Customers are rating our product very highly, exceeding industry standards."
                  : summaryData.averageRating > 3
                  ? "Customer ratings are good but there's room for improvement to reach excellence."
                  : "Customer ratings indicate significant issues that require immediate attention."}
              </span>
            </li>
            {summaryData.chartData && summaryData.chartData.trendData && summaryData.chartData.trendData.length > 1 && (
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
                <span className="text-indigo-800">
                  {(() => {
                    const trendData = summaryData.chartData.trendData;
                    const first = trendData[0];
                    const last = trendData[trendData.length - 1];
                    const ratingChange = last.rating - first.rating;
                    
                    if (Math.abs(ratingChange) < 0.2) {
                      return "Ratings have remained stable over the analyzed period.";
                    } else if (ratingChange > 0) {
                      return `Ratings are trending upward, improving by ${ratingChange.toFixed(1)} points from ${first.rating} to ${last.rating}.`;
                    } else {
                      return `Ratings are trending downward, decreasing by ${Math.abs(ratingChange).toFixed(1)} points from ${first.rating} to ${last.rating}.`;
                    }
                  })()}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}