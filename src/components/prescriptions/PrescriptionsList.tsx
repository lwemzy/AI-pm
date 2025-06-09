import React from 'react';
import { AlertCircleIcon, ChevronRightIcon, PillIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
interface PrescriptionsListProps {
  searchQuery: string;
  filterView: string;
  dateRange: string;
  onSelectPrescription: (id: string) => void;
}
export function PrescriptionsList({
  searchQuery,
  filterView,
  dateRange,
  onSelectPrescription
}: PrescriptionsListProps) {
  const {
    prescriptions,
    processedData
  } = useData();
  const prescriptionsWithId = prescriptions.map((prescription, index) => ({
    ...prescription,
    id: `P${index + 1}`,
    riskScore: processedData.riskScores[prescription.Doctor_ID] || 0,
    status: processedData.riskScores[prescription.Doctor_ID] >= 80 ? 'flagged' : 'normal'
  }));
  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };
  const filteredPrescriptions = prescriptionsWithId.filter(prescription => {
    const matchesSearch = prescription.Drug_Name.toLowerCase().includes(searchQuery.toLowerCase()) || prescription.Drug_Class.toLowerCase().includes(searchQuery.toLowerCase()) || prescription.Doctor_ID.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    const prescriptionDate = new Date(prescription.Prescription_Date);
    if (isNaN(prescriptionDate.getTime())) {
      return false; // Skip invalid dates
    }
    const daysAgo = (Date.now() - prescriptionDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysAgo > Number(dateRange)) return false;
    switch (filterView) {
      case 'high-risk':
        return prescription.riskScore >= 80;
      case 'flagged':
        return prescription.status === 'flagged';
      case 'controlled':
        return ['Opioid', 'Stimulant', 'Sedative'].includes(prescription.Drug_Class);
      default:
        return true;
    }
  });
  return <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prescription
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prescriber
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Score
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPrescriptions.map(prescription => <tr key={prescription.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectPrescription(prescription.id)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <PillIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {prescription.Drug_Name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {prescription.Drug_Class}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Dr. {prescription.Doctor_ID}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(prescription.Prescription_Date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeColor(prescription.riskScore)}`}>
                  {prescription.riskScore.toFixed(0)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {prescription.status === 'flagged' && <div className="flex items-center text-red-600">
                    <AlertCircleIcon size={16} className="mr-1" />
                    <span className="text-sm">Flagged</span>
                  </div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </td>
            </tr>)}
        </tbody>
      </table>
      {filteredPrescriptions.length === 0 && <div className="text-center py-12">
          <p className="text-gray-500 text-sm">
            No prescriptions found matching your criteria
          </p>
        </div>}
    </div>;
}