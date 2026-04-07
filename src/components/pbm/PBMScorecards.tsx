import React from 'react';
import { useData } from '../context/DataContext';

export function PBMScorecards() {
  const { processedData } = useData();
  const pbm = processedData.pbmMetrics;
  const audit = processedData.auditMetrics;
  const pricing = processedData.pricingMetrics;

  if (!pbm || pbm.pbmList.length === 0) {
    return <p className="text-center text-gray-500 py-8">No PBM data available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pbm.pbmList.map(pbmId => {
        const claims = pbm.claimsByPBM[pbmId] || 0;
        const avgCost = pbm.avgCostByPBM[pbmId] || 0;
        const ger = pbm.genericRateByPBM[pbmId] || 0;
        const ber = pbm.brandRateByPBM[pbmId] || 0;
        const spread = pricing?.spreadByPBM?.[pbmId] || 0;
        const gerVariance = audit?.gerVarianceByPBM?.[pbmId];
        const berVariance = audit?.berVarianceByPBM?.[pbmId];

        return (
          <div key={pbmId} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{pbmId}</h3>
              <span className="text-sm text-gray-500">{claims.toLocaleString()} claims</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Cost/Claim</span>
                <span className="text-sm font-medium text-gray-900">${avgCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Spread/Claim</span>
                <span className={`text-sm font-medium ${spread > 5 ? 'text-red-600' : 'text-gray-900'}`}>
                  ${spread.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Generic Effective Rate</span>
                <span className="text-sm font-medium text-gray-900">{ger.toFixed(1)}%</span>
              </div>
              {gerVariance != null && gerVariance !== 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">GER Variance</span>
                  <span className={`text-sm font-medium ${gerVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {gerVariance > 0 ? '+' : ''}{gerVariance.toFixed(1)}%
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Brand Effective Rate</span>
                <span className="text-sm font-medium text-gray-900">{ber.toFixed(1)}%</span>
              </div>
              {berVariance != null && berVariance !== 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">BER Variance</span>
                  <span className={`text-sm font-medium ${berVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {berVariance > 0 ? '+' : ''}{berVariance.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
