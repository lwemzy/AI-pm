import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export function ClaimVarianceTable() {
  const { prescriptions } = useData();
  const [minVariance, setMinVariance] = useState(0);

  const varianceClaims = React.useMemo(() => {
    return prescriptions
      .filter(rx => rx.Contracted_Rate != null && rx.Plan_Paid_Amount != null)
      .map((rx, i) => {
        const variance = (rx.Plan_Paid_Amount || 0) - (rx.Contracted_Rate || 0);
        const variancePercent = (rx.Contracted_Rate || 0) > 0
          ? (variance / (rx.Contracted_Rate || 1)) * 100
          : 0;
        return {
          index: i,
          drugName: rx.Drug_Name,
          pbm: rx.PBM_ID || '-',
          planPaid: rx.Plan_Paid_Amount || 0,
          contractedRate: rx.Contracted_Rate || 0,
          variance,
          variancePercent,
          date: rx.Prescription_Date
        };
      })
      .filter(c => Math.abs(c.variancePercent) >= minVariance)
      .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
      .slice(0, 100);
  }, [prescriptions, minVariance]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Claim Variance Detail</h2>
          <p className="mt-1 text-sm text-gray-500">Claims deviating from contracted rates</p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Min variance:</label>
          <select
            value={minVariance}
            onChange={e => setMinVariance(Number(e.target.value))}
            className="border border-gray-300 rounded-md text-sm px-2 py-1"
          >
            <option value={0}>All</option>
            <option value={2}>2%+</option>
            <option value={5}>5%+</option>
            <option value={10}>10%+</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PBM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contracted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variance %</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {varianceClaims.map(c => (
              <tr key={c.index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{c.drugName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.pbm}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${c.planPaid.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${c.contractedRate.toFixed(2)}</td>
                <td className={`px-6 py-4 text-sm font-medium ${c.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {c.variance > 0 ? '+' : ''}${c.variance.toFixed(2)}
                </td>
                <td className={`px-6 py-4 text-sm font-medium ${c.variancePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {c.variancePercent > 0 ? '+' : ''}{c.variancePercent.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {varianceClaims.length === 0 && (
          <p className="text-center text-gray-500 py-8">No claims with variance data found.</p>
        )}
      </div>
    </div>
  );
}
