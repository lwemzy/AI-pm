import React from 'react';
import { ScaleIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PBMScorecards } from './PBMScorecards';
import { PBMCostComparison } from './PBMCostComparison';
import { PlanSponsorView } from './PlanSponsorView';
import { FormularyAnalysis } from './FormularyAnalysis';

export function PBMComparisonPage() {
  const { processedData } = useData();

  if (!processedData.hasPricingData || !processedData.pbmMetrics || processedData.pbmMetrics.pbmList.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <ScaleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">No PBM Data Available</h2>
          <p className="mt-2 text-sm text-gray-500">
            Upload a CSV file with PBM_ID, PBM_Name, and pricing columns to enable cross-PBM analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">PBM Analysis</h1>
        <p className="mt-1 text-gray-600">
          Compare pricing, spread, and performance across Pharmacy Benefit Managers
        </p>
      </div>
      <PBMScorecards />
      <PBMCostComparison />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlanSponsorView />
        <FormularyAnalysis />
      </div>
    </div>
  );
}
