import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
interface PrescriptionPatternsProps {
  timeRange: string;
}
export function PrescriptionPatterns({
  timeRange
}: PrescriptionPatternsProps) {
  const {
    prescriptions
  } = useData();
  const patterns = prescriptions.reduce((acc: any, prescription) => {
    const date = new Date(prescription.Prescription_Date);
    let timeOfDay = 'Unknown';
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) timeOfDay = 'Morning';else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';else if (hour >= 17 && hour < 21) timeOfDay = 'Evening';else timeOfDay = 'Night';
    if (!acc[timeOfDay]) {
      acc[timeOfDay] = {
        name: timeOfDay,
        opioids: 0,
        stimulants: 0,
        sedatives: 0
      };
    }
    switch (prescription.Drug_Class.toLowerCase()) {
      case 'opioid':
        acc[timeOfDay].opioids++;
        break;
      case 'stimulant':
        acc[timeOfDay].stimulants++;
        break;
      case 'sedative':
        acc[timeOfDay].sedatives++;
        break;
    }
    return acc;
  }, {});
  const data = Object.values(patterns);
  return <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{
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
          <Bar dataKey="opioids" fill="#3b82f6" />
          <Bar dataKey="stimulants" fill="#10b981" />
          <Bar dataKey="sedatives" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>;
}