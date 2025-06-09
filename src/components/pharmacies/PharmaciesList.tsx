import React from 'react';
import { AlertCircleIcon, ChevronRightIcon, Building2Icon } from 'lucide-react';
import { useData } from '../context/DataContext';
interface PharmaciesListProps {
  searchQuery: string;
  filterView: string;
  onSelectPharmacy: (id: string) => void;
}
export function PharmaciesList({
  searchQuery,
  filterView,
  onSelectPharmacy
}: PharmaciesListProps) {
  const {
    prescriptions
  } = useData();
  const pharmaciesData = prescriptions.reduce((acc: any, prescription) => {
    const id = prescription.Pharmacy_ID;
    if (!acc[id]) {
      acc[id] = {
        id,
        name: `Pharmacy ${id}`,
        location: 'Unknown',
        riskScore: 0,
        dispensingVolume: 0,
        flaggedDispensations: 0,
        type: 'Unknown',
        status: 'active',
        controlledSubstances: 0
      };
    }
    acc[id].dispensingVolume++;
    if (['Opioid', 'Stimulant', 'Sedative'].includes(prescription.Drug_Class)) {
      acc[id].controlledSubstances++;
      acc[id].riskScore = acc[id].controlledSubstances / acc[id].dispensingVolume * 100;
    }
    return acc;
  }, {});
  const pharmacies = Object.values(pharmaciesData);
  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };
  const filteredPharmacies = pharmacies.filter((pharmacy: any) => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) || pharmacy.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    switch (filterView) {
      case 'high-risk':
        return pharmacy.riskScore >= 80;
      case 'flagged':
        return pharmacy.flaggedDispensations > 20;
      case 'inactive':
        return pharmacy.status === 'inactive';
      default:
        return true;
    }
  });
  return <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pharmacy
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Score
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dispensations
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Flags
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPharmacies.map(pharmacy => <tr key={pharmacy.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectPharmacy(pharmacy.id)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building2Icon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {pharmacy.name}
                    </div>
                    <div className="text-sm text-gray-500">{pharmacy.type}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pharmacy.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeColor(pharmacy.riskScore)}`}>
                  {pharmacy.riskScore}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pharmacy.dispensingVolume.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {pharmacy.flaggedDispensations > 0 && <div className="flex items-center text-red-600">
                    <AlertCircleIcon size={16} className="mr-1" />
                    <span className="text-sm">
                      {pharmacy.flaggedDispensations}
                    </span>
                  </div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </td>
            </tr>)}
        </tbody>
      </table>
      {filteredPharmacies.length === 0 && <div className="text-center py-12">
          <p className="text-gray-500 text-sm">
            No pharmacies found matching your criteria
          </p>
        </div>}
    </div>;
}