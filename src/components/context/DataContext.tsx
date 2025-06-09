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
}
interface ProcessedData {
  totalPrescriptions: number;
  totalDoctors: number;
  totalPharmacies: number;
  totalPatients: number;
  riskScores: {
    [key: string]: number;
  };
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
    riskScores: {}
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