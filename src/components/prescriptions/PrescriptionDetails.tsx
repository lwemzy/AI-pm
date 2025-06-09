import React from 'react';
import { XIcon, ChevronLeftIcon, UserIcon, PillIcon, CalendarIcon, AlertCircleIcon, ClockIcon, Building2Icon } from 'lucide-react';
interface PrescriptionDetailsProps {
  prescriptionId: string;
  onClose: () => void;
}
export function PrescriptionDetails({
  prescriptionId,
  onClose
}: PrescriptionDetailsProps) {
  // Mock data for prescription details
  const prescription = {
    id: prescriptionId,
    drug: 'Oxycodone',
    drugClass: 'Opioid',
    strength: '5mg',
    quantity: 60,
    daysSupply: 30,
    prescriber: {
      name: 'Dr. James Wilson',
      specialty: 'Pain Management',
      riskScore: 87
    },
    patient: {
      id: 'P12345',
      age: 45,
      gender: 'Male',
      riskScore: 72
    },
    pharmacy: {
      name: 'Central City Pharmacy',
      location: 'New York, NY'
    },
    date: '2023-10-15',
    riskScore: 85,
    status: 'flagged',
    alerts: [{
      id: 1,
      type: 'High Risk Combination',
      details: 'Potentially dangerous drug interaction detected',
      date: '2023-10-15T10:30:00'
    }, {
      id: 2,
      type: 'Frequency Alert',
      details: 'Early refill request pattern detected',
      date: '2023-10-15T10:30:00'
    }]
  };
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
                <PillIcon size={32} className="text-gray-500" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {prescription.drug}
                </h1>
                <p className="text-gray-600">
                  {prescription.strength} - {prescription.drugClass}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${prescription.riskScore >= 80 ? 'bg-red-100 text-red-800' : prescription.riskScore >= 60 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                Risk Score: {prescription.riskScore}
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
                  Prescription Details
                </h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Quantity
                  </label>
                  <p className="mt-1 text-lg text-gray-900">
                    {prescription.quantity} units
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Days Supply
                  </label>
                  <p className="mt-1 text-lg text-gray-900">
                    {prescription.daysSupply} days
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Prescribed Date
                  </label>
                  <p className="mt-1 text-lg text-gray-900">
                    {prescription.date}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <p className="mt-1 text-lg text-gray-900">
                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Alerts</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {prescription.alerts.map(alert => <div key={alert.id} className="px-6 py-4">
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
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Prescriber
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center">
                  <UserIcon size={20} className="text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {prescription.prescriber.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {prescription.prescriber.specialty}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prescription.prescriber.riskScore >= 80 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                    Risk Score: {prescription.prescriber.riskScore}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Pharmacy</h2>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center">
                  <Building2Icon size={20} className="text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {prescription.pharmacy.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {prescription.pharmacy.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Patient Information
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Patient ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {prescription.patient.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Demographics
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {prescription.patient.age} years,{' '}
                      {prescription.patient.gender}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Risk Score
                    </label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prescription.patient.riskScore >= 80 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                        {prescription.patient.riskScore}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}