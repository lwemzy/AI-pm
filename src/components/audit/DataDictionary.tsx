import React, { useState } from 'react';
import { BookOpenIcon, DownloadIcon, EyeIcon } from 'lucide-react';
import { useData } from '../context/DataContext';

const FIELD_DEFINITIONS: { field: string; category: string; description: string; exhibit: string; nationalInterest: string }[] = [
  // Core clinical fields
  { field: 'Doctor_ID', category: 'Clinical', description: 'Unique prescriber identifier (UUID)', exhibit: '', nationalInterest: '' },
  { field: 'Patient_ID', category: 'Clinical', description: 'Anonymized patient identifier (UUID)', exhibit: '', nationalInterest: '' },
  { field: 'Prescription_Date', category: 'Clinical', description: 'Date prescription was written (YYYY-MM-DD)', exhibit: '', nationalInterest: '' },
  { field: 'Drug_Name', category: 'Clinical', description: 'Standardized medication name', exhibit: '', nationalInterest: '' },
  { field: 'Drug_Class', category: 'Clinical', description: 'Therapeutic classification (Opioid, Stimulant, Sedative, Analgesic, etc.)', exhibit: 'Exhibit C', nationalInterest: 'HHS/OIG Fraud & Abuse — Controlled substance diversion detection' },
  { field: 'Quantity', category: 'Clinical', description: 'Number of units prescribed', exhibit: '', nationalInterest: '' },
  { field: 'Days_Supply', category: 'Clinical', description: 'Intended duration of prescription in days', exhibit: '', nationalInterest: '' },
  { field: 'Strength', category: 'Clinical', description: 'Medication strength/dosage', exhibit: '', nationalInterest: '' },
  { field: 'Pharmacy_ID', category: 'Clinical', description: 'Dispensing pharmacy identifier (UUID)', exhibit: '', nationalInterest: '' },

  // Pricing fields
  { field: 'NDC', category: 'Pricing', description: 'National Drug Code — links drug to pricing benchmarks', exhibit: 'Exhibit A', nationalInterest: 'Enables AWP-based spread pricing detection per FDA/CMS standards' },
  { field: 'AWP_Unit_Cost', category: 'Pricing', description: 'Average Wholesale Price per unit — benchmark pricing reference', exhibit: 'Exhibit A', nationalInterest: 'Industry standard benchmark for detecting markup anomalies' },
  { field: 'Ingredient_Cost', category: 'Pricing', description: 'Actual ingredient cost billed by pharmacy', exhibit: 'Exhibit A', nationalInterest: 'ERISA Fiduciary Duty (DOL 2026 Rule) — Spread pricing detection' },
  { field: 'Dispensing_Fee', category: 'Pricing', description: 'Fee charged by pharmacy for dispensing', exhibit: 'Exhibit A', nationalInterest: 'Component of total claim transparency' },
  { field: 'Total_Claim_Amount', category: 'Pricing', description: 'Total billed amount for the claim', exhibit: 'Exhibit A', nationalInterest: 'Aggregate cost tracking for plan sponsor accountability' },
  { field: 'Plan_Paid_Amount', category: 'Pricing', description: 'Amount paid by the health plan/PBM to pharmacy', exhibit: 'Exhibit A', nationalInterest: 'ERISA Fiduciary Duty — Identifies opaque PBM compensation' },
  { field: 'Patient_Paid_Amount', category: 'Pricing', description: 'Copay/coinsurance paid by patient out-of-pocket', exhibit: 'Exhibit A', nationalInterest: 'Patient cost burden analysis — 30% of Americans ration prescriptions' },
  { field: 'Reimbursement_Amount', category: 'Pricing', description: 'Actual amount pharmacy received from PBM', exhibit: 'Exhibit A', nationalInterest: 'Spread = Plan_Paid - Reimbursement — Core PBM transparency metric' },
  { field: 'Rebate_Amount', category: 'Pricing', description: 'Manufacturer rebate amount associated with this claim', exhibit: 'Exhibit B', nationalInterest: 'CAA 2026 Rebate Pass-Through — Audits 100% rebate passback compliance' },

  // PBM/Plan fields
  { field: 'PBM_ID', category: 'PBM/Plan', description: 'Pharmacy Benefit Manager identifier', exhibit: 'Exhibit A/D', nationalInterest: 'Cross-PBM comparison — FTC found top 3 PBMs process 80% of Rx' },
  { field: 'PBM_Name', category: 'PBM/Plan', description: 'Human-readable PBM name', exhibit: '', nationalInterest: '' },
  { field: 'Plan_Sponsor_ID', category: 'PBM/Plan', description: 'Employer or plan sponsor identifier', exhibit: 'Exhibit B', nationalInterest: 'Enables per-sponsor rebate passthrough and cost auditing' },
  { field: 'Plan_Sponsor_Name', category: 'PBM/Plan', description: 'Human-readable plan sponsor name', exhibit: '', nationalInterest: '' },
  { field: 'Formulary_Tier', category: 'PBM/Plan', description: 'Formulary placement tier (1-5)', exhibit: 'Exhibit D', nationalInterest: 'Detects formulary steering toward higher-cost drugs' },

  // Audit/Contract fields
  { field: 'Contracted_Rate', category: 'Audit', description: 'Contractually agreed reimbursement rate for this drug', exhibit: 'Exhibit D', nationalInterest: 'PBM Pricing Performance Guarantee monitoring' },
  { field: 'MAC_Price', category: 'Audit', description: 'Maximum Allowable Cost for generic drugs', exhibit: 'Exhibit D', nationalInterest: 'Generic drug pricing cap enforcement' },
  { field: 'GER_Guaranteed', category: 'Audit', description: 'Guaranteed Generic Effective Rate (percentage)', exhibit: 'Exhibit D', nationalInterest: 'PBM contractual compliance — Generic pricing guarantees' },
  { field: 'BER_Guaranteed', category: 'Audit', description: 'Guaranteed Brand Effective Rate (percentage)', exhibit: 'Exhibit D', nationalInterest: 'PBM contractual compliance — Brand pricing guarantees' },
  { field: 'Brand_Generic', category: 'Audit', description: 'Drug classification: brand or generic', exhibit: 'Exhibit D', nationalInterest: 'Required for GER/BER calculation per industry standard' }
];

export function DataDictionary() {
  const { prescriptions, processedData } = useData();
  const [showSample, setShowSample] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(FIELD_DEFINITIONS.map(f => f.category)))];
  const filteredFields = activeCategory === 'all' ? FIELD_DEFINITIONS : FIELD_DEFINITIONS.filter(f => f.category === activeCategory);

  // Detect which fields are populated in current data
  const populatedFields = new Set<string>();
  if (prescriptions.length > 0) {
    const sample = prescriptions.slice(0, 100);
    sample.forEach(rx => {
      Object.entries(rx).forEach(([key, val]) => {
        if (val != null && val !== '' && val !== undefined) populatedFields.add(key);
      });
    });
  }

  // Sample rows for exhibit
  const sampleRows = prescriptions.slice(0, 20);
  const sampleFields = FIELD_DEFINITIONS.map(f => f.field).filter(f => populatedFields.has(f));

  const exportDataDictionary = () => {
    const lines = [
      'PBM Pricing Transparency — Data Dictionary',
      `Generated: ${new Date().toLocaleDateString()}`,
      `Total Records: ${prescriptions.length.toLocaleString()}`,
      '',
      'Field,Category,Description,Exhibit Reference,National Interest Alignment,Populated',
      ...FIELD_DEFINITIONS.map(f =>
        `"${f.field}","${f.category}","${f.description}","${f.exhibit}","${f.nationalInterest}","${populatedFields.has(f.field) ? 'Yes' : 'No'}"`
      )
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_dictionary_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSampleRows = () => {
    if (sampleRows.length === 0) return;
    const headers = sampleFields;
    const rows = sampleRows.map(rx =>
      headers.map(h => {
        const val = (rx as any)[h];
        return val != null ? `"${val}"` : '';
      }).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_exhibit_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Data Dictionary */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpenIcon className="h-6 w-6 text-blue-600 mr-2" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">Data Dictionary — PBM Audit Schema</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {FIELD_DEFINITIONS.length} fields across {categories.length - 1} categories |
                  {' '}{populatedFields.size} populated in current dataset |
                  {' '}{prescriptions.length.toLocaleString()} total records
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={exportDataDictionary}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <DownloadIcon size={16} className="mr-2" />
                Export Dictionary
              </button>
              <button
                onClick={() => setShowSample(!showSample)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <EyeIcon size={16} className="mr-2" />
                {showSample ? 'Hide' : 'Show'} Sample Data
              </button>
            </div>
          </div>

          {/* Category filter */}
          <div className="mt-4 flex space-x-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-sm rounded-md ${activeCategory === cat ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {cat === 'all' ? 'All Fields' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exhibit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">National Interest Alignment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFields.map(f => (
                <tr key={f.field} className={populatedFields.has(f.field) ? 'bg-green-50' : ''}>
                  <td className="px-4 py-3 text-sm">
                    {populatedFields.has(f.field) ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{f.field}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      f.category === 'Clinical' ? 'bg-blue-100 text-blue-700' :
                      f.category === 'Pricing' ? 'bg-amber-100 text-amber-700' :
                      f.category === 'PBM/Plan' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>{f.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">{f.description}</td>
                  <td className="px-4 py-3 text-sm">
                    {f.exhibit && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">{f.exhibit}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-sm">{f.nationalInterest || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Data Rows */}
      {showSample && sampleRows.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Sample Data — First {sampleRows.length} Records</h2>
              <p className="mt-1 text-sm text-gray-500">Exhibit-ready sample for petition documentation</p>
            </div>
            <button
              onClick={exportSampleRows}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <DownloadIcon size={16} className="mr-2" />
              Export Sample
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">#</th>
                  {sampleFields.map(f => (
                    <th key={f} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{f}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sampleRows.map((rx, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-xs text-gray-400">{i + 1}</td>
                    {sampleFields.map(f => {
                      const val = (rx as any)[f];
                      return (
                        <td key={f} className="px-3 py-2 text-xs text-gray-700 whitespace-nowrap max-w-[150px] truncate" title={String(val ?? '')}>
                          {val != null ? String(val) : <span className="text-gray-300">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
