import React, { useState } from 'react';
import { SearchIcon, FilterIcon, MapIcon, ListIcon } from 'lucide-react';
import { PharmaciesList } from './PharmaciesList';
import { PharmacyProfile } from './PharmacyProfile';
import { PharmaciesMap } from './PharmaciesMap';
export function PharmaciesPage() {
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterView, setFilterView] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  return <div className="h-full">
      {selectedPharmacy ? <PharmacyProfile pharmacyId={selectedPharmacy} onClose={() => setSelectedPharmacy(null)} /> : <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pharmacies</h1>
              <p className="mt-1 text-gray-600">
                Monitor pharmacy activities and dispensing patterns
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex rounded-md shadow-sm">
                <button onClick={() => setViewMode('list')} className={`px-4 py-2 text-sm font-medium rounded-l-md border ${viewMode === 'list' ? 'bg-blue-50 text-blue-600 border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                  <ListIcon size={16} />
                </button>
                <button onClick={() => setViewMode('map')} className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b -ml-px ${viewMode === 'map' ? 'bg-blue-50 text-blue-600 border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                  <MapIcon size={16} />
                </button>
              </div>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <FilterIcon size={16} className="mr-2" />
                Filters
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
                  <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search pharmacies by name, ID, or location..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex items-center space-x-2">
                  <select value={filterView} onChange={e => setFilterView(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option value="all">All Pharmacies</option>
                    <option value="high-risk">High Risk</option>
                    <option value="flagged">Flagged</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            {viewMode === 'list' ? <PharmaciesList searchQuery={searchQuery} filterView={filterView} onSelectPharmacy={setSelectedPharmacy} /> : <PharmaciesMap onSelectPharmacy={setSelectedPharmacy} />}
          </div>
        </div>}
    </div>;
}