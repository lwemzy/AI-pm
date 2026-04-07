import React, { useState } from 'react';
import { AlertOctagonIcon, DownloadIcon } from 'lucide-react';
import { useData } from '../context/DataContext';

const SUSPECT_THRESHOLD = 50;

interface SuspectClaim {
  index: number;
  drugName: string;
  drugClass: string;
  pbm: string;
  planSponsor: string;
  planPaid: number;
  reimbursement: number;
  ingredientCost: number;
  pbmProfit: number;
  profitMargin: number;
  date: string;
  doctorId: string;
  pharmacyId: string;
  isSuspect: boolean;
}

export function SuspectClaimsTable() {
  const { prescriptions } = useData();
  const [threshold, setThreshold] = useState(SUSPECT_THRESHOLD);
  const [showSuspectOnly, setShowSuspectOnly] = useState(true);

  const claims = React.useMemo((): SuspectClaim[] => {
    return prescriptions
      .map((rx, i) => {
        if (rx.Plan_Paid_Amount == null || rx.Reimbursement_Amount == null) return null;
        const pbmProfit = rx.Plan_Paid_Amount - rx.Reimbursement_Amount;
        const profitMargin = rx.Plan_Paid_Amount > 0
          ? (pbmProfit / rx.Plan_Paid_Amount) * 100
          : 0;

        return {
          index: i,
          drugName: rx.Drug_Name,
          drugClass: rx.Drug_Class,
          pbm: rx.PBM_ID || rx.PBM_Name || '-',
          planSponsor: rx.Plan_Sponsor_Name || rx.Plan_Sponsor_ID || '-',
          planPaid: rx.Plan_Paid_Amount,
          reimbursement: rx.Reimbursement_Amount,
          ingredientCost: rx.Ingredient_Cost || 0,
          pbmProfit,
          profitMargin,
          date: rx.Prescription_Date,
          doctorId: rx.Doctor_ID,
          pharmacyId: rx.Pharmacy_ID,
          isSuspect: profitMargin >= threshold
        } as SuspectClaim;
      })
      .filter((c): c is SuspectClaim => c !== null)
      .sort((a, b) => b.profitMargin - a.profitMargin);
  }, [prescriptions, threshold]);

  const suspectClaims = showSuspectOnly ? claims.filter(c => c.isSuspect) : claims;
  const suspectCount = claims.filter(c => c.isSuspect).length;
  const totalSuspectProfit = claims.filter(c => c.isSuspect).reduce((sum, c) => sum + c.pbmProfit, 0);

  const exportCSV = () => {
    const headers = ['Drug Name', 'Drug Class', 'PBM', 'Plan Sponsor', 'Date', 'Plan Paid', 'Reimbursement', 'PBM Profit', 'Profit Margin %', 'Suspect Flag', 'Doctor ID', 'Pharmacy ID'];
    const rows = suspectClaims.map(c => [
      `"${c.drugName}"`, c.drugClass, c.pbm, c.planSponsor, c.date,
      c.planPaid.toFixed(2), c.reimbursement.toFixed(2), c.pbmProfit.toFixed(2),
      c.profitMargin.toFixed(1), c.isSuspect ? 'YES' : 'NO', c.doctorId, c.pharmacyId
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suspect_claims_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (claims.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Suspect Claims Analysis</h2>
        <p className="text-center text-gray-500 py-4">No claims with spread data available. Upload data with Plan_Paid_Amount and Reimbursement_Amount columns.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertOctagonIcon className="h-6 w-6 text-red-600 mr-2" />
            <div>
              <h2 className="text-lg font-medium text-gray-900">Suspect Claims — PBM Profit Margin Analysis</h2>
              <p className="mt-1 text-sm text-gray-500">
                Claims where PBM retains &ge;{threshold}% of plan-paid amount as profit
              </p>
            </div>
          </div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <DownloadIcon size={16} className="mr-2" />
            Export CSV
          </button>
        </div>

        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium">Suspect Claims</p>
            <p className="text-2xl font-bold text-red-900">{suspectCount.toLocaleString()}</p>
            <p className="text-xs text-red-600">{claims.length > 0 ? ((suspectCount / claims.length) * 100).toFixed(1) : 0}% of all priced claims</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium">Total Suspect PBM Profit</p>
            <p className="text-2xl font-bold text-red-900">${totalSuspectProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-red-600">Retained by PBMs on flagged claims</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 font-medium">Avg Suspect Margin</p>
            <p className="text-2xl font-bold text-gray-900">
              {suspectCount > 0 ? (claims.filter(c => c.isSuspect).reduce((s, c) => s + c.profitMargin, 0) / suspectCount).toFixed(1) : '0.0'}%
            </p>
            <p className="text-xs text-gray-600">Average profit margin on flagged claims</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Profit margin threshold:</label>
            <select
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="border border-gray-300 rounded-md text-sm px-2 py-1"
            >
              <option value={20}>20%+</option>
              <option value={30}>30%+</option>
              <option value={40}>40%+</option>
              <option value={50}>50%+ (default)</option>
              <option value={60}>60%+</option>
              <option value={75}>75%+</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showSuspectOnly}
              onChange={e => setShowSuspectOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span>Show suspect claims only</span>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flag</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drug</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PBM</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan Paid</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reimbursement</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PBM Profit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin %</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suspectClaims.slice(0, 100).map(c => (
              <tr key={c.index} className={c.isSuspect ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                <td className="px-4 py-4 text-sm">
                  {c.isSuspect ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                      SUSPECT
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      OK
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 max-w-[200px] truncate" title={c.drugName}>{c.drugName}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{c.drugClass}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{c.pbm}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{c.date}</td>
                <td className="px-4 py-4 text-sm text-gray-900">${c.planPaid.toFixed(2)}</td>
                <td className="px-4 py-4 text-sm text-gray-900">${c.reimbursement.toFixed(2)}</td>
                <td className={`px-4 py-4 text-sm font-semibold ${c.pbmProfit > 0 ? 'text-red-700' : 'text-green-700'}`}>
                  ${c.pbmProfit.toFixed(2)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${c.profitMargin >= 50 ? 'bg-red-600' : c.profitMargin >= 30 ? 'bg-orange-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(c.profitMargin, 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${c.profitMargin >= 50 ? 'text-red-700' : c.profitMargin >= 30 ? 'text-orange-600' : 'text-green-600'}`}>
                      {c.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {suspectClaims.length === 0 && (
          <p className="text-center text-gray-500 py-8">No claims match the current filters.</p>
        )}
        {suspectClaims.length > 100 && (
          <p className="text-center text-sm text-gray-500 py-4">Showing first 100 of {suspectClaims.length.toLocaleString()} claims. Export CSV for full dataset.</p>
        )}
      </div>
    </div>
  );
}
