'use client'

import { useState } from 'react'

export default function DateRangePicker({ dateRange, setDateRange }) {
  const handleDateChange = (e) => {
    const { name, value } = e.target
    setDateRange((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col">
        <label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={dateRange.startDate || ''}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-1">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={dateRange.endDate || ''}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}