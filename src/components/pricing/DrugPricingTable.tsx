import React, { useState } from 'react';
import { ArrowUpDownIcon } from 'lucide-react';
import { useData } from '../context/DataContext';

interface DrugPricing {
  drugName: string;
  ndc: string;
  avgAWP: number;
  avgIngredientCost: number;
  avgReimbursement: number;
  avgSpread: number;
  claimCount: number;
}

export function DrugPricingTable() {
  const { prescriptions } = useData();
  const [sortField, setSortField] = useState<keyof DrugPricing>('avgSpread');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const drugData = React.useMemo(() => {
    const groups: { [key: string]: { ndc: string; awp: number; ingredient: number; reimbursement: number; spread: number; count: number; spreadCount: number } } = {};

    prescriptions.forEach(rx => {
      if (rx.AWP_Unit_Cost == null && rx.Ingredient_Cost == null) return;
      const key = rx.Drug_Name;
      if (!groups[key]) groups[key] = { ndc: rx.NDC || '-', awp: 0, ingredient: 0, reimbursement: 0, spread: 0, count: 0, spreadCount: 0 };
      groups[key].awp += (rx.AWP_Unit_Cost || 0) * (rx.Quantity || 1);
      groups[key].ingredient += rx.Ingredient_Cost || 0;
      groups[key].reimbursement += rx.Reimbursement_Amount || 0;
      groups[key].count++;
      if (rx.Plan_Paid_Amount != null && rx.Reimbursement_Amount != null) {
        groups[key].spread += rx.Plan_Paid_Amount - rx.Reimbursement_Amount;
        groups[key].spreadCount++;
      }
    });

    return Object.entries(groups).map(([name, d]): DrugPricing => ({
      drugName: name,
      ndc: d.ndc,
      avgAWP: d.awp / d.count,
      avgIngredientCost: d.ingredient / d.count,
      avgReimbursement: d.reimbursement / d.count,
      avgSpread: d.spreadCount > 0 ? d.spread / d.spreadCount : 0,
      claimCount: d.count
    }));
  }, [prescriptions]);

  const sorted = [...drugData].sort((a, b) => {
    const av = a[sortField] ?? 0;
    const bv = b[sortField] ?? 0;
    return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  const toggleSort = (field: keyof DrugPricing) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const fmt = (v: number) => `$${v.toFixed(2)}`;

  const columns: { key: keyof DrugPricing; label: string; format?: (v: any) => string }[] = [
    { key: 'drugName', label: 'Drug Name' },
    { key: 'ndc', label: 'NDC' },
    { key: 'avgAWP', label: 'Avg AWP', format: fmt },
    { key: 'avgIngredientCost', label: 'Avg Ingredient', format: fmt },
    { key: 'avgReimbursement', label: 'Avg Reimbursement', format: fmt },
    { key: 'avgSpread', label: 'Avg Spread', format: fmt },
    { key: 'claimCount', label: 'Claims', format: (v: number) => v.toLocaleString() },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Drug Pricing Detail</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col.key} onClick={() => toggleSort(col.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center">
                    {col.label}
                    <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sorted.slice(0, 50).map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {col.format ? col.format(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <p className="text-center text-gray-500 py-8">No pricing data available.</p>
        )}
      </div>
    </div>
  );
}
