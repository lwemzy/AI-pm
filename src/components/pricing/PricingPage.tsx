import React from 'react';
import { DollarSignIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PricingOverview } from './PricingOverview';
import { SpreadAnalysis } from './SpreadAnalysis';
import { CostBreakdown } from './CostBreakdown';
import { DrugPricingTable } from './DrugPricingTable';
import { PricingInsights } from './PricingInsights';

export function PricingPage() {
  const { processedData } = useData();

  if (!processedData.hasPricingData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <DollarSignIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">No Pricing Data Available</h2>
          <p className="mt-2 text-sm text-gray-500">
            Upload a CSV file with pricing columns (AWP_Unit_Cost, Plan_Paid_Amount, Reimbursement_Amount, etc.)
            to enable pricing transparency analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pricing Transparency</h1>
        <p className="mt-1 text-gray-600">Analyze drug pricing, spread, and cost breakdowns across the supply chain</p>
      </div>
      <PricingOverview />
      <PricingInsights />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpreadAnalysis />
        <CostBreakdown />
      </div>
      <DrugPricingTable />
    </div>
  );
}
