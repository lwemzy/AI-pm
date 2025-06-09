import React, { useState } from 'react';
import { SearchIcon, FilterIcon, SlidersIcon, DownloadIcon } from 'lucide-react';
import { DoctorsList } from './DoctorsList';
import { DoctorProfile } from './DoctorProfile';
export function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterView, setFilterView] = useState('all'); // all, high-risk, flagged
  return <div className="h-full">
      {selectedDoctor ? <DoctorProfile doctorId={selectedDoctor} onClose={() => setSelectedDoctor(null)} /> : <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
              <p className="mt-1 text-gray-600">
                Monitor and analyze prescriber patterns and risk levels
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <SlidersIcon size={16} className="mr-2" />
                Advanced Filters
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <DownloadIcon size={16} className="mr-2" />
                Export List
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
                  <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search doctors by name, ID, or specialty..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex items-center space-x-2">
                  <select value={filterView} onChange={e => setFilterView(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option value="all">All Doctors</option>
                    <option value="high-risk">High Risk</option>
                    <option value="flagged">Flagged</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <DoctorsList searchQuery={searchQuery} filterView={filterView} onSelectDoctor={setSelectedDoctor} />
          </div>
        </div>}
    </div>;
}