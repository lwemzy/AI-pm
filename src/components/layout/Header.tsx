import React from 'react';
import { BellIcon, SearchIcon, MenuIcon } from 'lucide-react';
export function Header() {
  return <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center md:hidden">
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100">
            <MenuIcon size={24} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 md:hidden">
            RxMonitor AI
          </h2>
          <div className="max-w-lg w-full lg:max-w-xs hidden md:block">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-gray-400" />
              </div>
              <input id="search" name="search" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search prescriptions, doctors, patients..." type="search" />
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 relative">
              <BellIcon size={20} />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="ml-3 relative">
              <div>
                <button className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    JD
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>;
}