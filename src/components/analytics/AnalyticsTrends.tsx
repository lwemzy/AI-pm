import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
interface AnalyticsTrendsProps {
  timeRange: string;
}
export function AnalyticsTrends({
  timeRange
}: AnalyticsTrendsProps) {
  const {
    prescriptions
  } = useData();
  const generateData = () => {
    const grouped = prescriptions.reduce((acc: any, prescription) => {
      const date = new Date(prescription.Prescription_Date);
      if (isNaN(date.getTime())) {
        return acc; // Skip invalid dates
      }
      const key = date.toISOString().split('T')[0];
      if (!acc[key]) {
        acc[key] = {
          name: key,
          opioids: 0,
          stimulants: 0,
          sedatives: 0
        };
      }
      switch (prescription.Drug_Class.toLowerCase()) {
        case 'opioid':
          acc[key].opioids++;
          break;
        case 'stimulant':
          acc[key].stimulants++;
          break;
        case 'sedative':
          acc[key].sedatives++;
          break;
      }
      return acc;
    }, {});
    return Object.values(grouped).sort((a: any, b: any) => a.name.localeCompare(b.name));
  };
  const data = generateData();
  return <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="opioids" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="stimulants" stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sedatives" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>;
}