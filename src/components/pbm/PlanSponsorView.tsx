import React from 'react';
import { useData } from '../context/DataContext';

export function PlanSponsorView() {
  const { prescriptions } = useData();

  const sponsorData = React.useMemo(() => {
    const groups: { [id: string]: { name: string; totalPaid: number; totalRebates: number; totalClaims: number; pbms: Set<string> } } = {};

    prescriptions.forEach(rx => {
      if (!rx.Plan_Sponsor_ID) return;
      if (!groups[rx.Plan_Sponsor_ID]) {
        groups[rx.Plan_Sponsor_ID] = {
          name: rx.Plan_Sponsor_Name || rx.Plan_Sponsor_ID,
          totalPaid: 0,
          totalRebates: 0,
          totalClaims: 0,
          pbms: new Set()
        };
      }
      const g = groups[rx.Plan_Sponsor_ID];
      g.totalPaid += rx.Plan_Paid_Amount || 0;
      g.totalRebates += rx.Rebate_Amount || 0;
      g.totalClaims++;
      if (rx.PBM_ID) g.pbms.add(rx.PBM_ID);
    });

    return Object.entries(groups)
      .map(([id, d]) => ({
        id,
        name: d.name,
        totalPaid: d.totalPaid,
        totalRebates: d.totalRebates,
        totalClaims: d.totalClaims,
        netCost: d.totalPaid - d.totalRebates,
        pbmCount: d.pbms.size,
        avgCostPerClaim: d.totalClaims > 0 ? d.totalPaid / d.totalClaims : 0
      }))
      .sort((a, b) => b.totalPaid - a.totalPaid);
  }, [prescriptions]);

  if (sponsorData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Plan Sponsor Analysis</h2>
        <p className="text-center text-gray-500 py-4">No plan sponsor data available. Include Plan_Sponsor_ID in your CSV.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Plan Sponsor Analysis</h2>
        <p className="mt-1 text-sm text-gray-500">Spending and rebate analysis by plan sponsor</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sponsor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claims</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rebates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg/Claim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PBMs</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sponsorData.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.totalClaims.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${s.totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="px-6 py-4 text-sm text-green-600">${s.totalRebates.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${s.netCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="px-6 py-4 text-sm text-gray-500">${s.avgCostPerClaim.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.pbmCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
