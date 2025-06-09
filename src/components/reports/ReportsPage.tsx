import React, { useState } from 'react';
import { FileTextIcon, DownloadIcon, FilterIcon } from 'lucide-react';
import { ReportsList } from './ReportsList';
import { ReportViewer } from './ReportViewer';
export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30');
  const [filterView, setFilterView] = useState('all');
  return <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="mt-1 text-gray-600">
            Generate and view detailed prescription monitoring reports
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <FilterIcon size={16} className="mr-2" />
            Filters
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <DownloadIcon size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <ReportsList selectedReport={selectedReport} onSelectReport={setSelectedReport} />
        </div>
        <div className="col-span-9">
          <ReportViewer reportType={selectedReport || 'summary'} dateRange={dateRange} filterView={filterView} />
        </div>
      </div>
    </div>;
}