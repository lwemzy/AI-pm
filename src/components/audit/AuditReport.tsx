import React from 'react';
import { useData } from '../context/DataContext';

export function AuditReport() {
  const { processedData } = useData();
  const audit = processedData.auditMetrics;
  const pbm = processedData.pbmMetrics;

  if (!audit) return null;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Audit Summary Report</h2>
        <p className="mt-1 text-sm text-gray-500">Contract compliance findings overview</p>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Auditable Records</p>
              <p className="text-xl font-bold text-gray-900">{audit.totalAuditableRecords.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Overall Compliance</p>
              <p className={`text-xl font-bold ${audit.complianceRate >= 95 ? 'text-green-600' : audit.complianceRate >= 85 ? 'text-amber-600' : 'text-red-600'}`}>
                {audit.complianceRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Overcharges</p>
              <p className="text-xl font-bold text-red-600">${audit.totalOverchargeAmount.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Variance Claims</p>
              <p className="text-xl font-bold text-gray-900">{(audit.overchargeCount + audit.underchargeCount).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {Object.keys(audit.gerActualByPBM).length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">GER/BER by PBM</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">PBM</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actual GER</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">GER Variance</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actual BER</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">BER Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.keys(audit.gerActualByPBM).map(pbmId => (
                    <tr key={pbmId}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{pbmId}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{audit.gerActualByPBM[pbmId]?.toFixed(1)}%</td>
                      <td className={`px-4 py-2 text-sm font-medium ${(audit.gerVarianceByPBM[pbmId] || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {(audit.gerVarianceByPBM[pbmId] || 0) > 0 ? '+' : ''}{(audit.gerVarianceByPBM[pbmId] || 0).toFixed(1)}%
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{audit.berActualByPBM[pbmId]?.toFixed(1) || '-'}%</td>
                      <td className={`px-4 py-2 text-sm font-medium ${(audit.berVarianceByPBM[pbmId] || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {audit.berVarianceByPBM[pbmId] != null ? `${(audit.berVarianceByPBM[pbmId] || 0) > 0 ? '+' : ''}${(audit.berVarianceByPBM[pbmId] || 0).toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
