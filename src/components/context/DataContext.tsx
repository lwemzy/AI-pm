import React, { useState, createContext, useContext } from 'react';
interface Prescription {
  Doctor_ID: string;
  Patient_ID: string;
  Prescription_Date: string;
  Drug_Name: string;
  Drug_Class: string;
  Quantity: number;
  Days_Supply: number;
  Strength: string;
  Pharmacy_ID: string;
  // Pricing fields (optional for backward compat)
  NDC?: string;
  AWP_Unit_Cost?: number;
  Ingredient_Cost?: number;
  Dispensing_Fee?: number;
  Total_Claim_Amount?: number;
  Plan_Paid_Amount?: number;
  Patient_Paid_Amount?: number;
  Reimbursement_Amount?: number;
  Rebate_Amount?: number;
  // PBM / Plan fields
  PBM_ID?: string;
  PBM_Name?: string;
  Plan_Sponsor_ID?: string;
  Plan_Sponsor_Name?: string;
  Formulary_Tier?: number;
  // Audit / contract fields
  Contracted_Rate?: number;
  MAC_Price?: number;
  GER_Guaranteed?: number;
  BER_Guaranteed?: number;
  // Classification
  Brand_Generic?: 'brand' | 'generic';
}
interface PricingMetrics {
  totalClaimAmount: number;
  totalPlanPaid: number;
  totalPatientPaid: number;
  totalRebates: number;
  averageSpread: number;
  spreadByPBM: { [pbmId: string]: number };
  claimCountWithPricing: number;
}

interface PBMMetrics {
  pbmList: string[];
  planSponsorList: string[];
  claimsByPBM: { [pbmId: string]: number };
  avgCostByPBM: { [pbmId: string]: number };
  genericRateByPBM: { [pbmId: string]: number };
  brandRateByPBM: { [pbmId: string]: number };
}

interface AuditMetrics {
  totalAuditableRecords: number;
  complianceRate: number;
  overchargeCount: number;
  underchargeCount: number;
  totalOverchargeAmount: number;
  gerActualByPBM: { [pbmId: string]: number };
  gerVarianceByPBM: { [pbmId: string]: number };
  berActualByPBM: { [pbmId: string]: number };
  berVarianceByPBM: { [pbmId: string]: number };
}

interface ProcessedData {
  totalPrescriptions: number;
  totalDoctors: number;
  totalPharmacies: number;
  totalPatients: number;
  riskScores: {
    [key: string]: number;
  };
  hasPricingData: boolean;
  pricingMetrics?: PricingMetrics;
  pbmMetrics?: PBMMetrics;
  auditMetrics?: AuditMetrics;
}
interface DataContextType {
  prescriptions: Prescription[];
  setPrescriptions: (data: Prescription[]) => void;
  processedData: ProcessedData;
  setProcessedData: (data: ProcessedData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
const DataContext = createContext<DataContextType | undefined>(undefined);
export function DataProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData>({
    totalPrescriptions: 0,
    totalDoctors: 0,
    totalPharmacies: 0,
    totalPatients: 0,
    riskScores: {},
    hasPricingData: false
  });
  return <DataContext.Provider value={{
    prescriptions,
    setPrescriptions,
    processedData,
    setProcessedData,
    isLoading,
    setIsLoading
  }}>
      {children}
    </DataContext.Provider>;
}
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}