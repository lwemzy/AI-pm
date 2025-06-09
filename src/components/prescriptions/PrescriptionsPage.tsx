import React, { useState } from 'react';
import { SearchIcon, FilterIcon, SlidersIcon, DownloadIcon } from 'lucide-react';
import { PrescriptionsList } from './PrescriptionsList';
import { PrescriptionDetails } from './PrescriptionDetails';
export function PrescriptionsPage() {
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [filterView, setFilterView] = useState('all');
  return <div className="h-full">
      {selectedPrescription ? <PrescriptionDetails prescriptionId={selectedPrescription} onClose={() => setSelectedPrescription(null)} /> : <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Prescriptions
              </h1>
              <p className="mt-1 text-gray-600">
                Monitor and analyze prescription patterns
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
                <SlidersIcon size={16} className="mr-2" />
                Advanced Filters
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <DownloadIcon size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="relative flex-1 max-w-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon size={18} className="text-gray-400" />
                  </div>
                  <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search prescriptions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex items-center space-x-2">
                  <select value={filterView} onChange={e => setFilterView(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option value="all">All Prescriptions</option>
                    <option value="high-risk">High Risk</option>
                    <option value="flagged">Flagged</option>
                    <option value="controlled">Controlled Substances</option>
                  </select>
                </div>
              </div>
            </div>
            <PrescriptionsList searchQuery={searchQuery} filterView={filterView} dateRange={dateRange} onSelectPrescription={setSelectedPrescription} />
          </div>
        </div>}
    </div>;
}