import React from 'react';
import { XIcon, ChevronLeftIcon, MapPinIcon, PhoneIcon, MailIcon, AlertCircleIcon, ClockIcon, Building2Icon, PillIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PrescriptionChart } from '../dashboard/PrescriptionChart';
interface PharmacyProfileProps {
  pharmacyId: string;
  onClose: () => void;
}
export function PharmacyProfile({
  pharmacyId,
  onClose
}: PharmacyProfileProps) {
  const {
    prescriptions
  } = useData();
  const pharmacyPrescriptions = prescriptions.filter(p => p.Pharmacy_ID === pharmacyId);
  const stats = {
    total: pharmacyPrescriptions.length,
    controlledSubstances: pharmacyPrescriptions.filter(p => ['Opioid', 'Stimulant', 'Sedative'].includes(p.Drug_Class)).length,
    lastMonth: pharmacyPrescriptions.filter(p => {
      const prescDate = new Date(p.Prescription_Date);
      if (isNaN(prescDate.getTime())) {
        return false; // Skip invalid dates
      }
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return prescDate >= thirtyDaysAgo;
    }).length,
    uniqueDoctors: new Set(pharmacyPrescriptions.map(p => p.Doctor_ID)).size
  };
  const riskScore = stats.controlledSubstances / stats.total * 100;
  const alerts = [];
  if (stats.controlledSubstances / stats.total > 0.5) {
    alerts.push({
      id: 1,
      type: 'High Volume Alert',
      details: 'Unusual volume of controlled substance dispensing',
      date: new Date().toISOString()
    });
  }
  if (riskScore >= 80) {
    alerts.push({
      id: 2,
      type: 'Risk Score Alert',
      details: 'Pharmacy risk score exceeds threshold',
      date: new Date().toISOString()
    });
  }
  return <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onClose} className="inline-flex items-center text-gray-600 hover:text-gray-800">
              <ChevronLeftIcon size={20} className="mr-1" />
              Back to List
            </button>
            <button onClick={onClose} className="p-2 rounded-md text-gray-400 hover:text-gray-500">
              <XIcon size={20} />
            </button>
          </div>
          <div className="mt-4 flex items-start justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Building2Icon size={32} className="text-gray-500" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Pharmacy {pharmacyId}
                </h1>
                <p className="text-gray-600">ID: {pharmacyId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${riskScore >= 80 ? 'bg-red-100 text-red-800' : riskScore >= 60 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                Risk Score: {Math.round(riskScore)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Dispensing Activity
                </h2>
              </div>
              <div className="p-6">
                <PrescriptionChart />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Alerts
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {alerts.map(alert => <div key={alert.id} className="px-6 py-4">
                    <div className="flex items-start">
                      <AlertCircleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {alert.type}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {alert.details}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(alert.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>)}
                {alerts.length === 0 && <div className="px-6 py-4 text-gray-500 text-sm">
                    No active alerts
                  </div>}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Dispensing Statistics
                </h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <PillIcon size={18} className="mr-2" />
                    Total Dispensations
                  </div>
                  <span className="font-medium">
                    {stats.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <AlertCircleIcon size={18} className="mr-2" />
                    Controlled Substances
                  </div>
                  <span className="font-medium text-red-600">
                    {stats.controlledSubstances.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon size={18} className="mr-2" />
                    Last 30 Days
                  </div>
                  <span className="font-medium">
                    {stats.lastMonth.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Top Prescribers
                </h2>
              </div>
              <div className="px-6 py-4">
                {Object.entries(pharmacyPrescriptions.reduce((acc: any, p) => {
                acc[p.Doctor_ID] = (acc[p.Doctor_ID] || 0) + 1;
                return acc;
              }, {})).sort(([, a]: any, [, b]: any) => b - a).slice(0, 5).map(([doctorId, count]: any) => <div key={doctorId} className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">
                        Dr. {doctorId}
                      </span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}