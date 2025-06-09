import React from 'react';
import { LayoutDashboardIcon, UploadIcon, UserIcon, FileTextIcon, AlertCircleIcon, SettingsIcon, LogOutIcon, LineChartIcon, PillIcon, Building2Icon } from 'lucide-react';
interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}
export function Sidebar({
  currentPage,
  setCurrentPage
}: SidebarProps) {
  const menuItems = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboardIcon size={20} />
  }, {
    id: 'upload',
    label: 'Upload Data',
    icon: <UploadIcon size={20} />
  }, {
    id: 'analytics',
    label: 'Analytics',
    icon: <LineChartIcon size={20} />
  }, {
    id: 'doctors',
    label: 'Doctors',
    icon: <UserIcon size={20} />
  }, {
    id: 'pharmacies',
    label: 'Pharmacies',
    icon: <Building2Icon size={20} />
  }, {
    id: 'prescriptions',
    label: 'Prescriptions',
    icon: <PillIcon size={20} />
  }, {
    id: 'reports',
    label: 'Reports',
    icon: <FileTextIcon size={20} />
  }, {
    id: 'alerts',
    label: 'Alerts',
    icon: <AlertCircleIcon size={20} />
  }];
  return <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:block">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">RxMonitor AI</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map(item => <li key={item.id}>
                <button onClick={() => setCurrentPage(item.id)} className={`flex items-center w-full px-3 py-2 rounded-lg text-sm ${currentPage === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              </li>)}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <ul className="space-y-1">
            <li>
              <button className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm">
                <span className="mr-3">
                  <SettingsIcon size={20} />
                </span>
                Settings
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm">
                <span className="mr-3">
                  <LogOutIcon size={20} />
                </span>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>;
}