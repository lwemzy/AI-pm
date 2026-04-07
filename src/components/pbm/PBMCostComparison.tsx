import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../context/DataContext';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function PBMCostComparison() {
  const { prescriptions, processedData } = useData();
  const pbmList = processedData.pbmMetrics?.pbmList || [];
  const [selectedDrugs] = useState<string[]>([]);

  const comparisonData = React.useMemo(() => {
    // Get top 10 drugs by claim count
    const drugCounts: { [drug: string]: number } = {};
    prescriptions.forEach(rx => {
      if (rx.PBM_ID && rx.Plan_Paid_Amount != null) {
        drugCounts[rx.Drug_Name] = (drugCounts[rx.Drug_Name] || 0) + 1;
      }
    });
    const topDrugs = selectedDrugs.length > 0
      ? selectedDrugs
      : Object.entries(drugCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name]) => name);

    // Build comparison: for each drug, avg Plan_Paid per PBM
    return topDrugs.map(drug => {
      const entry: any = { drug: drug.length > 30 ? drug.substring(0, 30) + '...' : drug };
      pbmList.forEach(pbm => {
        const rxForDrugPBM = prescriptions.filter(rx => rx.Drug_Name === drug && rx.PBM_ID === pbm && rx.Plan_Paid_Amount != null);
        if (rxForDrugPBM.length > 0) {
          entry[pbm] = rxForDrugPBM.reduce((sum, rx) => sum + (rx.Plan_Paid_Amount || 0), 0) / rxForDrugPBM.length;
        }
      });
      return entry;
    });
  }, [prescriptions, pbmList, selectedDrugs]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Cross-PBM Cost Comparison</h2>
        <p className="mt-1 text-sm text-gray-500">Average plan-paid amount per drug across PBMs</p>
      </div>
      <div className="p-6">
        {comparisonData.length > 0 && pbmList.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="drug" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={80} />
              <YAxis tickFormatter={(v) => `$${v.toFixed(0)}`} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              {pbmList.map((pbm, i) => (
                <Bar key={pbm} dataKey={pbm} fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 py-8">No cross-PBM comparison data available.</p>
        )}
      </div>
    </div>
  );
}
