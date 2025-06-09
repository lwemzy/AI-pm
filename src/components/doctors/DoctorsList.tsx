import React from 'react';
import { AlertCircleIcon, ChevronRightIcon, UserIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
interface DoctorsListProps {
  searchQuery: string;
  filterView: string;
  onSelectDoctor: (id: string) => void;
}
export function DoctorsList({
  searchQuery,
  filterView,
  onSelectDoctor
}: DoctorsListProps) {
  const {
    prescriptions,
    processedData
  } = useData();
  // Group prescriptions by doctor
  const doctors = Object.entries(prescriptions.reduce((acc: any, prescription) => {
    const doctorId = prescription.Doctor_ID;
    if (!acc[doctorId]) {
      acc[doctorId] = {
        id: doctorId,
        prescriptionCount: 0,
        flaggedPrescriptions: 0,
        riskScore: processedData.riskScores[doctorId] || 0
      };
    }
    acc[doctorId].prescriptionCount++;
    // You could add logic here to determine if a prescription is flagged
    return acc;
  }, {})).map(([id, data]) => ({
    ...data,
    name: `Dr. ${id}`,
    specialty: 'Unknown',
    location: 'Unknown' // In a real app, you'd have this data
  }));
  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || doctor.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    switch (filterView) {
      case 'high-risk':
        return doctor.riskScore >= 80;
      case 'flagged':
        return doctor.flaggedPrescriptions > 0;
      default:
        return true;
    }
  });
  return <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Doctor
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Risk Score
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prescriptions
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
          {filteredDoctors.map(doctor => <tr key={doctor.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectDoctor(doctor.id)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {doctor.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {doctor.specialty}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doctor.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeColor(doctor.riskScore)}`}>
                  {doctor.riskScore}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doctor.prescriptionCount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {doctor.flaggedPrescriptions > 0 && <div className="flex items-center text-red-600">
                    <AlertCircleIcon size={16} className="mr-1" />
                    <span className="text-sm">
                      {doctor.flaggedPrescriptions}
                    </span>
                  </div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </td>
            </tr>)}
        </tbody>
      </table>
      {filteredDoctors.length === 0 && <div className="text-center py-12">
          <p className="text-gray-500 text-sm">
            No doctors found matching your criteria
          </p>
        </div>}
    </div>;
}