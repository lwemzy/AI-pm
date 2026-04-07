import React from 'react';
import { DollarSignIcon, TrendingUpIcon, ReceiptIcon, WalletIcon } from 'lucide-react';
import { useData } from '../context/DataContext';

export function PricingOverview() {
  const { processedData } = useData();
  const pm = processedData.pricingMetrics;

  if (!pm) return null;

  const patientShare = pm.totalClaimAmount > 0
    ? ((pm.totalPatientPaid / pm.totalClaimAmount) * 100).toFixed(1)
    : '0.0';

  const metrics = [
    {
      title: 'Total Claims Amount',
      value: `$${pm.totalClaimAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${pm.claimCountWithPricing.toLocaleString()} claims with pricing data`,
      icon: <ReceiptIcon className="h-6 w-6 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Average Spread',
      value: `$${pm.averageSpread.toFixed(2)}`,
      subtitle: 'Per claim (Plan Paid - Reimbursement)',
      icon: <TrendingUpIcon className="h-6 w-6 text-amber-600" />,
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Total Rebates',
      value: `$${pm.totalRebates.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Rebate amount reported',
      icon: <DollarSignIcon className="h-6 w-6 text-emerald-600" />,
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Patient Cost Share',
      value: `${patientShare}%`,
      subtitle: `$${pm.totalPatientPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total patient paid`,
      icon: <WalletIcon className="h-6 w-6 text-red-600" />,
      bgColor: 'bg-red-50'
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
