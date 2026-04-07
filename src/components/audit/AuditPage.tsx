import React from 'react';
import { ClipboardCheckIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { AuditSummary } from './AuditSummary';
import { ContractComplianceChart } from './ContractComplianceChart';
import { ClaimVarianceTable } from './ClaimVarianceTable';
import { AuditAlerts } from './AuditAlerts';
import { AuditReport } from './AuditReport';
import { SuspectClaimsTable } from './SuspectClaimsTable';
import { DataDictionary } from './DataDictionary';

export function AuditPage() {
  const { processedData } = useData();

  if (!processedData.hasPricingData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <ClipboardCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">No Audit Data Available</h2>
          <p className="mt-2 text-sm text-gray-500">
            Upload a CSV file with Contracted_Rate, Plan_Paid_Amount, GER_Guaranteed, BER_Guaranteed, and Brand_Generic columns
            to enable contract compliance auditing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Contract Compliance Audit</h1>
        <p className="mt-1 text-gray-600">
          Verify PBM pricing guarantees and identify overcharges against contracted terms
        </p>
      </div>
      <AuditSummary />
      <SuspectClaimsTable />
      <AuditAlerts />
      <ContractComplianceChart />
      <ClaimVarianceTable />
      <AuditReport />
      <DataDictionary />
    </div>
  );
}
