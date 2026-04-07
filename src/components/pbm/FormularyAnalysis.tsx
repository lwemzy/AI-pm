import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../context/DataContext';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export function FormularyAnalysis() {
  const { prescriptions, processedData } = useData();
  const pbmList = processedData.pbmMetrics?.pbmList || [];

  const tierData = React.useMemo(() => {
    const tiers: { [tier: number]: { [pbm: string]: number } } = {};

    prescriptions.forEach(rx => {
      if (rx.Formulary_Tier == null || !rx.PBM_ID) return;
      if (!tiers[rx.Formulary_Tier]) tiers[rx.Formulary_Tier] = {};
      tiers[rx.Formulary_Tier][rx.PBM_ID] = (tiers[rx.Formulary_Tier][rx.PBM_ID] || 0) + 1;
    });

    return Object.entries(tiers)
      .map(([tier, pbmCounts]) => ({
        tier: `Tier ${tier}`,
        ...pbmCounts
      }))
      .sort((a, b) => parseInt(a.tier.split(' ')[1]) - parseInt(b.tier.split(' ')[1]));
  }, [prescriptions]);

  if (tierData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Formulary Tier Analysis</h2>
        <p className="text-center text-gray-500 py-4">No formulary tier data available. Include Formulary_Tier in your CSV.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Formulary Tier Distribution</h2>
        <p className="mt-1 text-sm text-gray-500">Claims by formulary tier across PBMs</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={tierData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tier" />
            <YAxis />
            <Tooltip />
            <Legend />
            {pbmList.map((pbm, i) => (
              <Bar key={pbm} dataKey={pbm} fill={COLORS[i % COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
