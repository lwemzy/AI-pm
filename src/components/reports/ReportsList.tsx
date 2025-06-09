import React from 'react';
import { FileTextIcon, AlertCircleIcon, BarChartIcon, MapIcon, UserIcon, TrendingUpIcon } from 'lucide-react';
interface ReportsListProps {
  selectedReport: string | null;
  onSelectReport: (report: string) => void;
}
export function ReportsList({
  selectedReport,
  onSelectReport
}: ReportsListProps) {
  const reports = [{
    id: 'summary',
    name: 'Summary Report',
    description: 'Overview of key metrics and trends',
    icon: <BarChartIcon size={20} />
  }, {
    id: 'compliance',
    name: 'Compliance Report',
    description: 'Detailed compliance analysis',
    icon: <AlertCircleIcon size={20} />
  }, {
    id: 'prescriber',
    name: 'Prescriber Analysis',
    description: 'Detailed prescriber behavior analysis',
    icon: <UserIcon size={20} />
  }, {
    id: 'geographic',
    name: 'Geographic Analysis',
    description: 'Regional prescription patterns',
    icon: <MapIcon size={20} />
  }, {
    id: 'trends',
    name: 'Trend Analysis',
    description: 'Long-term prescription trends',
    icon: <TrendingUpIcon size={20} />
  }];
  return <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Available Reports</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {reports.map(report => <button key={report.id} onClick={() => onSelectReport(report.id)} className={`w-full px-4 py-4 flex items-start hover:bg-gray-50 focus:outline-none ${selectedReport === report.id ? 'bg-blue-50' : ''}`}>
            <div className={`flex-shrink-0 mt-1 ${selectedReport === report.id ? 'text-blue-600' : 'text-gray-400'}`}>
              {report.icon}
            </div>
            <div className="ml-3 text-left">
              <p className={`text-sm font-medium ${selectedReport === report.id ? 'text-blue-600' : 'text-gray-900'}`}>
                {report.name}
              </p>
              <p className="mt-1 text-sm text-gray-500">{report.description}</p>
            </div>
          </button>)}
      </div>
    </div>;
}