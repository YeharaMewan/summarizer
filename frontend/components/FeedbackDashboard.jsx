'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function FeedbackDashboard({ summaryData }) {
  const [sentimentData, setSentimentData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [trendData, setTrendData] = useState([])
  
  useEffect(() => {
    if (summaryData && summaryData.sampleFeedback) {
      // This is where we would normally process real data
      // For demo purposes, we'll create visualization data based on the sample
      
      // Mock sentiment distribution
      setSentimentData([
        { name: 'Positive', value: 65 },
        { name: 'Neutral', value: 20 },
        { name: 'Negative', value: 15 }
      ])
      
      // Extract categories from sample feedback if available
      if (summaryData.sampleFeedback[0]?.Category) {
        const categories = {}
        summaryData.sampleFeedback.forEach(item => {
          if (item.Category) {
            categories[item.Category] = (categories[item.Category] || 0) + 1
          }
        })
        
        const categoryDataArr = Object.keys(categories).map(key => ({
          name: key,
          value: categories[key]
        }))
        
        setCategoryData(categoryDataArr)
      } else {
        // Fallback mock data
        setCategoryData([
          { name: 'Performance', value: 35 },
          { name: 'Usability', value: 25 },
          { name: 'Features', value: 20 },
          { name: 'Support', value: 10 },
          { name: 'Value', value: 10 }
        ])
      }
      
      // Mock trend data (last 6 months)
      setTrendData([
        { name: 'Nov', rating: 3.8, feedback: 42 },
        { name: 'Dec', rating: 3.9, feedback: 38 },
        { name: 'Jan', rating: 3.7, feedback: 45 },
        { name: 'Feb', rating: 4.1, feedback: 52 },
        { name: 'Mar', rating: 4.2, feedback: 58 },
        { name: 'Apr', rating: 4.4, feedback: 64 }
      ])
    }
  }, [summaryData])
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-blue-600">{`${payload[0].name}: ${payload[0].value}${payload[0].name === 'rating' ? '/5' : ''}`}</p>
          {payload[1] && <p className="text-green-600">{`${payload[1].name}: ${payload[1].value}`}</p>}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Feedback Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Sentiment Distribution</h3>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Feedback by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Feedback Trends */}
        <div className="bg-gray-50 p-4 rounded-lg lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Feedback Trends (Last 6 Months)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="rating" name="Avg Rating" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="feedback" name="Feedback Count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-blue-800 font-medium">Total Feedback</div>
          <div className="text-2xl font-bold text-blue-900">{summaryData.totalFeedback}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-sm text-green-800 font-medium">Average Rating</div>
          <div className="text-2xl font-bold text-green-900">
            {summaryData.averageRating ? summaryData.averageRating.toFixed(1) : 'N/A'}
            {summaryData.averageRating && <span className="text-lg ml-1">/ 5</span>}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="text-sm text-purple-800 font-medium">Sentiment Score</div>
          <div className="text-2xl font-bold text-purple-900">7.6 / 10</div>
        </div>
      </div>
    </div>
  )
}