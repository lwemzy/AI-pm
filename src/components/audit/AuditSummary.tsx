import React from 'react';
import { ShieldCheckIcon, AlertTriangleIcon, BanIcon, DollarSignIcon } from 'lucide-react';
import { useData } from '../context/DataContext';

export function AuditSummary() {
  const { processedData } = useData();
  const audit = processedData.auditMetrics;

  if (!audit) return null;

  const metrics = [
    {
      title: 'Auditable Claims',
      value: audit.totalAuditableRecords.toLocaleString(),
      subtitle: 'Claims with contracted rates',
      icon: <ShieldCheckIcon className="h-6 w-6 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Compliance Rate',
      value: `${audit.complianceRate.toFixed(1)}%`,
      subtitle: 'Within tolerance of contracted rate',
      icon: <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />,
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Overcharges',
      value: audit.overchargeCount.toLocaleString(),
      subtitle: `${audit.underchargeCount.toLocaleString()} undercharges detected`,
      icon: <AlertTriangleIcon className="h-6 w-6 text-red-600" />,
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Overcharge Amount',
      value: `$${audit.totalOverchargeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Excess charged above contracted rates',
      icon: <DollarSignIcon className="h-6 w-6 text-amber-600" />,
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${metric.bgColor} p-3 rounded-full mr-4`}>
              {metric.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">{metric.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
