import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
export function PrescriptionChart() {
  const {
    prescriptions
  } = useData();
  const generateMonthlyData = () => {
    const dates = prescriptions.map(p => new Date(p.Prescription_Date));
    const validDates = dates.filter(date => !isNaN(date.getTime()));
    if (validDates.length === 0) return [];
    const latestDate = new Date(Math.max(...validDates.map(d => d.getTime())));
    const sixMonthsAgo = new Date(latestDate);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const monthlyData = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(sixMonthsAgo);
      date.setMonth(date.getMonth() + i);
      monthlyData.push({
        month: date.toLocaleString('default', {
          month: 'short',
          year: '2-digit'
        }),
        timestamp: date.getTime(),
        opioids: 0,
        stimulants: 0,
        sedatives: 0,
        total: 0
      });
    }
    prescriptions.forEach(prescription => {
      const prescDate = new Date(prescription.Prescription_Date);
      if (isNaN(prescDate.getTime())) return;
      if (prescDate >= sixMonthsAgo && prescDate <= latestDate) {
        const monthIndex = monthlyData.findIndex(data => Math.abs(new Date(data.timestamp).getMonth() - prescDate.getMonth()) < 1 && new Date(data.timestamp).getFullYear() === prescDate.getFullYear());
        if (monthIndex !== -1) {
          const drugClass = prescription.Drug_Class.toLowerCase();
          if (drugClass === 'opioid') monthlyData[monthIndex].opioids++;else if (drugClass === 'stimulant') monthlyData[monthIndex].stimulants++;else if (drugClass === 'sedative') monthlyData[monthIndex].sedatives++;
          monthlyData[monthIndex].total++;
        }
      }
    });
    return monthlyData;
  };
  const data = generateMonthlyData();
  const calculateTrend = (drugType: string) => {
    if (data.length < 2) return 0;
    const firstValue = data[0][drugType as keyof (typeof data)[0]] as number;
    const lastValue = data[data.length - 1][drugType as keyof (typeof data)[0]] as number;
    return (lastValue - firstValue) / firstValue * 100;
  };
  const trends = {
    opioids: calculateTrend('opioids'),
    stimulants: calculateTrend('stimulants'),
    sedatives: calculateTrend('sedatives')
  };
  const CustomTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => <div key={index} className="flex items-center justify-between space-x-8">
              <span className="text-sm" style={{
            color: entry.color
          }}>
                {entry.name}:
              </span>
              <span className="text-sm font-medium">
                {entry.value.toLocaleString()}
              </span>
            </div>)}
        </div>;
    }
    return null;
  };
  if (data.length === 0) {
    return <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">No prescription data available</p>
      </div>;
  }
  return <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" tick={{
            fill: '#6B7280',
            fontSize: 12
          }} />
            <YAxis stroke="#6B7280" tick={{
            fill: '#6B7280',
            fontSize: 12
          }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="opioids" stroke="#EF4444" strokeWidth={2} dot={{
            fill: '#EF4444',
            r: 4
          }} activeDot={{
            r: 6
          }} name="Opioids" />
            <Line type="monotone" dataKey="stimulants" stroke="#F59E0B" strokeWidth={2} dot={{
            fill: '#F59E0B',
            r: 4
          }} activeDot={{
            r: 6
          }} name="Stimulants" />
            <Line type="monotone" dataKey="sedatives" stroke="#6366F1" strokeWidth={2} dot={{
            fill: '#6366F1',
            r: 4
          }} activeDot={{
            r: 6
          }} name="Sedatives" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-red-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-red-700">Opioids</span>
            <span className={`text-sm font-medium ${trends.opioids > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {trends.opioids > 0 ? '+' : ''}
              {Math.round(trends.opioids)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-red-600">
            {trends.opioids > 10 ? 'Significant increase in prescriptions' : 'Stable prescription pattern'}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-amber-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-700">
              Stimulants
            </span>
            <span className={`text-sm font-medium ${trends.stimulants > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {trends.stimulants > 0 ? '+' : ''}
              {Math.round(trends.stimulants)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-amber-600">
            {trends.stimulants > 10 ? 'Increasing prescription trend' : 'Normal prescription levels'}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-indigo-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-indigo-700">
              Sedatives
            </span>
            <span className={`text-sm font-medium ${trends.sedatives > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {trends.sedatives > 0 ? '+' : ''}
              {Math.round(trends.sedatives)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-indigo-600">
            {trends.sedatives > 10 ? 'Notable increase in prescriptions' : 'Within expected range'}
          </p>
        </div>
      </div>
    </div>;
}