'use client'

export default function DateRangePicker({ dateRange, setDateRange }) {
  const handleDateChange = (e) => {
    const { name, value } = e.target
    setDateRange((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col w-full md:w-auto">
        <label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={dateRange.startDate || ''}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
      </div>
      
      <div className="flex flex-col w-full md:w-auto">
        <label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-2">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={dateRange.endDate || ''}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
      </div>
    </div>
  )
}