import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { useData } from '../context/DataContext';

export function ContractComplianceChart() {
  const { processedData } = useData();
  const audit = processedData.auditMetrics;

  if (!audit) return null;

  const gerData = Object.keys(audit.gerActualByPBM).map(pbm => ({
    pbm,
    'Actual GER': audit.gerActualByPBM[pbm],
    'GER Variance': audit.gerVarianceByPBM[pbm] || 0
  }));

  const berData = Object.keys(audit.berActualByPBM).map(pbm => ({
    pbm,
    'Actual BER': audit.berActualByPBM[pbm],
    'BER Variance': audit.berVarianceByPBM[pbm] || 0
  }));

  if (gerData.length === 0 && berData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Contract Compliance</h2>
        <p className="text-center text-gray-500 py-4">
          No GER/BER data available. Include GER_Guaranteed, BER_Guaranteed, Brand_Generic, Ingredient_Cost, and AWP_Unit_Cost in your CSV.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {gerData.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Generic Effective Rate (GER) by PBM</h2>
            <p className="mt-1 text-sm text-gray-500">Actual GER vs guaranteed — positive variance means PBM underperforms guarantee</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pbm" />
                <YAxis tickFormatter={(v) => `${v.toFixed(0)}%`} />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Legend />
                <Bar dataKey="Actual GER" fill="#3b82f6" />
                <Bar dataKey="GER Variance" fill="#ef4444" />
                <ReferenceLine y={0} stroke="#666" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {berData.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Brand Effective Rate (BER) by PBM</h2>
            <p className="mt-1 text-sm text-gray-500">Actual BER vs guaranteed</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={berData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pbm" />
                <YAxis tickFormatter={(v) => `${v.toFixed(0)}%`} />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Legend />
                <Bar dataKey="Actual BER" fill="#f59e0b" />
                <Bar dataKey="BER Variance" fill="#ef4444" />
                <ReferenceLine y={0} stroke="#666" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
