import React from 'react';
import { DollarSignIcon, TrendingUpIcon, AlertTriangleIcon, ShieldAlertIcon } from 'lucide-react';
import { useData } from '../context/DataContext';

export function PricingInsights() {
  const { prescriptions, processedData } = useData();
  const pm = processedData.pricingMetrics;

  if (!pm) return null;

  const insights: { title: string; insight: string; type: 'warning' | 'info'; icon: React.ReactNode }[] = [];

  // Spread insight
  if (pm.averageSpread > 0) {
    insights.push({
      title: 'Spread Pricing Analysis',
      insight: `Average spread per claim is $${pm.averageSpread.toFixed(2)}. Across ${pm.claimCountWithPricing.toLocaleString()} claims, PBMs retain an estimated $${(pm.averageSpread * pm.claimCountWithPricing).toLocaleString(undefined, { maximumFractionDigits: 0 })} in total spread.`,
      type: pm.averageSpread > 5 ? 'warning' : 'info',
      icon: <TrendingUpIcon className="h-5 w-5" />
    });
  }

  // Markup analysis
  const rxWithAWP = prescriptions.filter(rx => rx.AWP_Unit_Cost != null && rx.Ingredient_Cost != null);
  if (rxWithAWP.length > 0) {
    const avgMarkup = rxWithAWP.reduce((sum, rx) => {
      const awpTotal = (rx.AWP_Unit_Cost || 0) * (rx.Quantity || 1);
      return sum + (awpTotal > 0 ? ((rx.Ingredient_Cost || 0) / awpTotal) * 100 : 0);
    }, 0) / rxWithAWP.length;

    insights.push({
      title: 'Ingredient Cost vs AWP',
      insight: `Average ingredient cost is ${avgMarkup.toFixed(1)}% of AWP across ${rxWithAWP.length.toLocaleString()} claims with pricing data.`,
      type: avgMarkup > 80 ? 'warning' : 'info',
      icon: <DollarSignIcon className="h-5 w-5" />
    });
  }

  // Rebate passthrough
  if (pm.totalRebates > 0 && pm.totalClaimAmount > 0) {
    const rebatePercent = (pm.totalRebates / pm.totalClaimAmount) * 100;
    insights.push({
      title: 'Rebate Analysis',
      insight: `Rebates represent ${rebatePercent.toFixed(1)}% of total claim amounts ($${pm.totalRebates.toLocaleString(undefined, { maximumFractionDigits: 0 })} of $${pm.totalClaimAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}).`,
      type: rebatePercent < 5 ? 'warning' : 'info',
      icon: <ShieldAlertIcon className="h-5 w-5" />
    });
  }

  // Patient burden
  if (pm.totalPatientPaid > 0) {
    const patientShare = (pm.totalPatientPaid / pm.totalClaimAmount) * 100;
    insights.push({
      title: 'Patient Cost Burden',
      insight: `Patients bear ${patientShare.toFixed(1)}% of total drug costs out-of-pocket, averaging $${(pm.totalPatientPaid / pm.claimCountWithPricing).toFixed(2)} per claim.`,
      type: patientShare > 30 ? 'warning' : 'info',
      icon: <AlertTriangleIcon className="h-5 w-5" />
    });
  }

  if (insights.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <DollarSignIcon className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-lg font-medium text-gray-900">Pricing Insights</h2>
      </div>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-lg ${insight.type === 'warning' ? 'bg-red-50' : 'bg-blue-50'}`}>
            <div className="flex items-start">
              <div className={`${insight.type === 'warning' ? 'text-red-600' : 'text-blue-600'} mt-0.5`}>
                {insight.icon}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">{insight.title}</h3>
                <p className={`mt-1 text-sm ${insight.type === 'warning' ? 'text-red-700' : 'text-blue-700'}`}>
                  {insight.insight}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
