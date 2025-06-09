import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
export function RiskScoreAnalysis() {
  const {
    prescriptions,
    processedData
  } = useData();
  const calculateMetrics = (startDate: Date) => {
    const relevantPrescriptions = prescriptions.filter(p => {
      const prescDate = new Date(p.Prescription_Date);
      return prescDate >= startDate;
    });
    const uniqueDoctors = new Set(relevantPrescriptions.map(p => p.Doctor_ID));
    const uniquePatients = new Set(relevantPrescriptions.map(p => p.Patient_ID));
    const controlledSubstances = relevantPrescriptions.filter(p => ['Opioid', 'Stimulant', 'Sedative'].includes(p.Drug_Class)).length;
    const riskScores = Object.values(processedData.riskScores);
    const avgRiskScore = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
    return {
      prescriptionVolume: relevantPrescriptions.length / prescriptions.length * 100,
      highRiskDrugs: controlledSubstances / relevantPrescriptions.length * 100,
      patientCount: uniquePatients.size / processedData.totalPatients * 100,
      doctorCount: uniqueDoctors.size / processedData.totalDoctors * 100,
      prescriptionPatterns: avgRiskScore,
      complianceScore: Math.max(100 - avgRiskScore, 0)
    };
  };
  const currentDate = new Date();
  const previousPeriodStart = new Date(currentDate);
  previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
  const currentPeriodStart = new Date(previousPeriodStart);
  currentPeriodStart.setMonth(currentPeriodStart.getMonth() - 1);
  const currentMetrics = calculateMetrics(currentPeriodStart);
  const previousMetrics = calculateMetrics(previousPeriodStart);
  const data = [{
    subject: 'Prescription Volume',
    current: Math.round(currentMetrics.prescriptionVolume),
    previous: Math.round(previousMetrics.prescriptionVolume),
    fullMark: 100
  }, {
    subject: 'High-Risk Drugs',
    current: Math.round(currentMetrics.highRiskDrugs),
    previous: Math.round(previousMetrics.highRiskDrugs),
    fullMark: 100
  }, {
    subject: 'Patient Count',
    current: Math.round(currentMetrics.patientCount),
    previous: Math.round(previousMetrics.patientCount),
    fullMark: 100
  }, {
    subject: 'Doctor Count',
    current: Math.round(currentMetrics.doctorCount),
    previous: Math.round(previousMetrics.doctorCount),
    fullMark: 100
  }, {
    subject: 'Prescription Patterns',
    current: Math.round(currentMetrics.prescriptionPatterns),
    previous: Math.round(previousMetrics.prescriptionPatterns),
    fullMark: 100
  }, {
    subject: 'Compliance Score',
    current: Math.round(currentMetrics.complianceScore),
    previous: Math.round(previousMetrics.complianceScore),
    fullMark: 100
  }];
  return <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Current Period" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
          <Radar name="Previous Period" dataKey="previous" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>;
}