import React from 'react';
import { MetricsCards } from './MetricsCards';
import { PrescriptionChart } from './PrescriptionChart';
import { useData } from '../context/DataContext';
export function DashboardOverview() {
  const {
    prescriptions,
    processedData
  } = useData();
  // Calculate top flagged doctors
  const topFlaggedDoctors = Object.entries(processedData.riskScores).map(([doctorId, riskScore]) => {
    const doctorPrescriptions = prescriptions.filter(p => p.Doctor_ID === doctorId);
    const specialty = 'Unknown'; // In a real app, this would come from doctor data
    return {
      id: doctorId,
      name: `Dr. ${doctorId}`,
      specialty,
      score: riskScore,
      prescriptionCount: doctorPrescriptions.length
    };
  }).sort((a, b) => b.score - a.score).slice(0, 4);
  // Calculate most prescribed controlled substances
  const controlledSubstances = prescriptions.filter(p => ['Opioid', 'Stimulant', 'Sedative'].includes(p.Drug_Class)).reduce((acc: any, prescription) => {
    const key = prescription.Drug_Name;
    if (!acc[key]) {
      acc[key] = {
        name: prescription.Drug_Name,
        category: prescription.Drug_Class,
        count: 0
      };
    }
    acc[key].count++;
    return acc;
  }, {});
  const topControlledSubstances = Object.values(controlledSubstances).sort((a: any, b: any) => b.count - a.count).slice(0, 4);
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Prescription Monitoring Dashboard
        </h1>
        <p className="mt-1 text-gray-600">
          Overview of prescription patterns and monitoring metrics
        </p>
      </div>
      <MetricsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Prescription Trends
          </h2>
          <PrescriptionChart />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Top Flagged Doctors
          </h2>
          <div className="space-y-4">
            {topFlaggedDoctors.map(doctor => <div key={doctor.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{doctor.name}</p>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className="h-2.5 rounded-full" style={{
                  width: `${doctor.score}%`,
                  backgroundColor: doctor.score > 80 ? '#ef4444' : doctor.score > 60 ? '#f97316' : '#eab308'
                }}></div>
                  </div>
                  <span className={`text-sm font-medium ${doctor.score > 80 ? 'text-red-600' : doctor.score > 60 ? 'text-orange-600' : 'text-yellow-600'}`}>
                    {Math.round(doctor.score)}
                  </span>
                </div>
              </div>)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Most Prescribed Controlled Substances
          </h2>
          <div className="space-y-4">
            {topControlledSubstances.map((drug: any) => <div key={drug.name} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{drug.name}</p>
                  <p className="text-sm text-gray-500">{drug.category}</p>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {drug.count.toLocaleString()} prescriptions
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}