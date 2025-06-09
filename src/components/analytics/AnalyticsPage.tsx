import React, { useState } from 'react';
import { TrendingUpIcon, FilterIcon, DownloadIcon } from 'lucide-react';
import { AnalyticsTrends } from './AnalyticsTrends';
import { GeographicDistribution } from './GeographicDistribution';
import { PrescriptionPatterns } from './PrescriptionPatterns';
import { RiskScoreAnalysis } from './RiskScoreAnalysis';
import { useData } from '../context/DataContext';
import { SmartInsights } from './SmartInsights';
export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30');
  const {
    prescriptions,
    processedData
  } = useData();
  const calculateInsights = () => {
    const riskScores = Object.values(processedData.riskScores);
    const highRiskCount = riskScores.filter(score => score >= 80).length;
    const highRiskPercentage = highRiskCount / riskScores.length * 100;
    const avgRiskScore = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
    const pharmacyRiskScores = prescriptions.reduce((acc: any, prescription) => {
      const id = prescription.Pharmacy_ID;
      if (!acc[id]) {
        acc[id] = {
          totalPrescriptions: 0,
          controlledSubstances: 0
        };
      }
      acc[id].totalPrescriptions++;
      if (['Opioid', 'Stimulant', 'Sedative'].includes(prescription.Drug_Class)) {
        acc[id].controlledSubstances++;
      }
      return acc;
    }, {});
    const highRiskLocations = Object.values(pharmacyRiskScores).filter((pharmacy: any) => pharmacy.controlledSubstances / pharmacy.totalPrescriptions * 100 >= 80).length;
    return [{
      title: 'High-Risk Prescribers',
      value: `${Math.round(highRiskPercentage)}%`,
      change: '(Historical data not available)',
      description: 'of prescribers have high risk scores'
    }, {
      title: 'Average Risk Score',
      value: Math.round(avgRiskScore).toString(),
      change: '(Historical data not available)',
      description: 'average risk score across all prescribers'
    }, {
      title: 'Geographic Hotspots',
      value: highRiskLocations.toString(),
      change: '(Historical data not available)',
      description: 'locations with high controlled substance ratios'
    }];
  };
  const insights = calculateInsights();
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-gray-600">
            Detailed analysis of prescription patterns and risk indicators
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <FilterIcon size={16} className="mr-2" />
              Filters
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <DownloadIcon size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>
      <SmartInsights />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Prescription Trends
          </h2>
          <AnalyticsTrends timeRange={timeRange} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Geographic Distribution
          </h2>
          <GeographicDistribution />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Prescription Patterns
          </h2>
          <PrescriptionPatterns timeRange={timeRange} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Risk Score Analysis
          </h2>
          <RiskScoreAnalysis />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight, index) => <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  {insight.title}
                </h3>
                <TrendingUpIcon size={20} className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {insight.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-gray-400 italic">{insight.change}</span>{' '}
                {insight.description}
              </p>
            </div>)}
        </div>
      </div>
    </div>;
}