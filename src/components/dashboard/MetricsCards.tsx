import React from 'react';
import { AlertCircleIcon, TrendingUpIcon, UsersIcon, PillIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
export function MetricsCards() {
  const {
    prescriptions,
    processedData
  } = useData();
  const calculateMonthlyMetrics = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    // Get start dates for current and previous months
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
    // Filter prescriptions for current and previous months
    const currentMonthPrescriptions = prescriptions.filter(p => {
      const date = new Date(p.Prescription_Date);
      return date >= currentMonthStart && date < now;
    });
    const previousMonthPrescriptions = prescriptions.filter(p => {
      const date = new Date(p.Prescription_Date);
      return date >= previousMonthStart && date < currentMonthStart;
    });
    // Calculate current month metrics
    const currentMetrics = {
      totalPrescriptions: currentMonthPrescriptions.length,
      uniqueDoctors: new Set(currentMonthPrescriptions.map(p => p.Doctor_ID)).size,
      highRiskDoctors: new Set(currentMonthPrescriptions.filter(p => (processedData.riskScores[p.Doctor_ID] || 0) >= 80).map(p => p.Doctor_ID)).size,
      uniquePharmacies: new Set(currentMonthPrescriptions.map(p => p.Pharmacy_ID)).size
    };
    // Calculate previous month metrics
    const previousMetrics = {
      totalPrescriptions: previousMonthPrescriptions.length,
      uniqueDoctors: new Set(previousMonthPrescriptions.map(p => p.Doctor_ID)).size,
      highRiskDoctors: new Set(previousMonthPrescriptions.filter(p => (processedData.riskScores[p.Doctor_ID] || 0) >= 80).map(p => p.Doctor_ID)).size,
      uniquePharmacies: new Set(previousMonthPrescriptions.map(p => p.Pharmacy_ID)).size
    };
    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return (current - previous) / previous * 100;
    };
    return {
      prescriptionsChange: calculateChange(currentMetrics.totalPrescriptions, previousMetrics.totalPrescriptions),
      doctorsChange: calculateChange(currentMetrics.uniqueDoctors, previousMetrics.uniqueDoctors),
      highRiskChange: calculateChange(currentMetrics.highRiskDoctors, previousMetrics.highRiskDoctors),
      pharmaciesChange: calculateChange(currentMetrics.uniquePharmacies, previousMetrics.uniquePharmacies)
    };
  };
  const changes = calculateMonthlyMetrics();
  // Calculate high risk doctors (those with risk score >= 80)
  const highRiskDoctors = Object.values(processedData.riskScores).filter(score => score >= 80).length;
  const metrics = [{
    title: 'Total Prescriptions',
    value: processedData.totalPrescriptions.toLocaleString(),
    change: changes.prescriptionsChange.toFixed(1),
    changeType: changes.prescriptionsChange >= 0 ? 'increase' : 'decrease',
    icon: <PillIcon className="h-6 w-6 text-blue-600" />,
    bgColor: 'bg-blue-50'
  }, {
    title: 'Total Doctors',
    value: processedData.totalDoctors.toLocaleString(),
    change: changes.doctorsChange.toFixed(1),
    changeType: changes.doctorsChange >= 0 ? 'increase' : 'decrease',
    icon: <UsersIcon className="h-6 w-6 text-amber-600" />,
    bgColor: 'bg-amber-50'
  }, {
    title: 'High Risk Doctors',
    value: highRiskDoctors.toLocaleString(),
    change: changes.highRiskChange.toFixed(1),
    changeType: changes.highRiskChange >= 0 ? 'increase' : 'decrease',
    icon: <AlertCircleIcon className="h-6 w-6 text-red-600" />,
    bgColor: 'bg-red-50'
  }, {
    title: 'Total Pharmacies',
    value: processedData.totalPharmacies.toLocaleString(),
    change: changes.pharmaciesChange.toFixed(1),
    changeType: changes.pharmaciesChange >= 0 ? 'increase' : 'decrease',
    icon: <TrendingUpIcon className="h-6 w-6 text-emerald-600" />,
    bgColor: 'bg-emerald-50'
  }];
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${metric.bgColor} p-3 rounded-full mr-4`}>
              {metric.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                {metric.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-sm font-medium ${metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {metric.changeType === 'increase' ? '+' : ''}
              {metric.change}%{' '}
              {metric.changeType === 'increase' ? 'increase' : 'decrease'}
            </span>
            <span className="text-sm text-gray-500"> from last month</span>
          </div>
        </div>)}
    </div>;
}