import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useData } from '../context/DataContext';

export function SpreadAnalysis() {
  const { prescriptions } = useData();
  const [groupBy, setGroupBy] = useState<'drug' | 'pharmacy' | 'pbm'>('drug');

  const spreadData = React.useMemo(() => {
    const groups: { [key: string]: { totalSpread: number; count: number } } = {};

    prescriptions.forEach(rx => {
      if (rx.Plan_Paid_Amount == null || rx.Reimbursement_Amount == null) return;
      const spread = rx.Plan_Paid_Amount - rx.Reimbursement_Amount;
      let key = '';
      if (groupBy === 'drug') key = rx.Drug_Name;
      else if (groupBy === 'pharmacy') key = rx.Pharmacy_ID.substring(0, 8);
      else if (groupBy === 'pbm') key = rx.PBM_ID || 'Unknown';

      if (!groups[key]) groups[key] = { totalSpread: 0, count: 0 };
      groups[key].totalSpread += spread;
      groups[key].count++;
    });

    return Object.entries(groups)
      .map(([name, data]) => ({
        name: name.length > 25 ? name.substring(0, 25) + '...' : name,
        avgSpread: data.totalSpread / data.count,
        totalSpread: data.totalSpread,
        claims: data.count
      }))
      .sort((a, b) => b.totalSpread - a.totalSpread)
      .slice(0, 15);
  }, [prescriptions, groupBy]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Spread Pricing Analysis</h2>
        <div className="flex space-x-2">
          {(['drug', 'pharmacy', 'pbm'] as const).map(option => (
            <button
              key={option}
              onClick={() => setGroupBy(option)}
              className={`px-3 py-1 text-sm rounded-md ${groupBy === option ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              By {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {spreadData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={spreadData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `$${v.toFixed(0)}`} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total Spread']}
                labelFormatter={(label) => `${label}`}
              />
              <ReferenceLine x={0} stroke="#666" />
              <Bar dataKey="totalSpread" fill="#3b82f6" name="Total Spread" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 py-8">No spread data available. Upload data with Plan_Paid_Amount and Reimbursement_Amount columns.</p>
        )}
      </div>
    </div>
  );
}
