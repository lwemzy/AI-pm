import React from 'react';
import { DollarSignIcon, TrendingUpIcon, ShieldCheckIcon, WalletIcon } from 'lucide-react';
import { useData } from '../context/DataContext';

export function PricingMetricsCards() {
  const { processedData } = useData();

  if (!processedData.hasPricingData || !processedData.pricingMetrics) return null;

  const pm = processedData.pricingMetrics;
  const audit = processedData.auditMetrics;

  const metrics = [
    {
      title: 'Total Drug Spend',
      value: `$${pm.totalClaimAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: <DollarSignIcon className="h-6 w-6 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Avg Spread/Claim',
      value: `$${pm.averageSpread.toFixed(2)}`,
      icon: <TrendingUpIcon className="h-6 w-6 text-amber-600" />,
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Compliance Rate',
      value: audit ? `${audit.complianceRate.toFixed(1)}%` : 'N/A',
      icon: <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />,
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total Rebates',
      value: `$${pm.totalRebates.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: <WalletIcon className="h-6 w-6 text-purple-600" />,
      bgColor: 'bg-purple-50'
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
        </div>
      ))}
    </div>
  );
}
