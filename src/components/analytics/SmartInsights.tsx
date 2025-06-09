import React from 'react';
import { BrainCircuitIcon, TrendingUpIcon, AlertCircleIcon, MapPinIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
export function SmartInsights() {
  const {
    prescriptions,
    processedData
  } = useData();
  const generateInsights = () => {
    // Analyze prescription patterns
    const recentPrescriptions = prescriptions.filter(p => {
      const date = new Date(p.Prescription_Date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    });
    // Pattern detection
    const controlledSubstanceRatio = recentPrescriptions.filter(p => ['Opioid', 'Stimulant', 'Sedative'].includes(p.Drug_Class)).length / recentPrescriptions.length;
    // Risk trend analysis
    const riskScores = Object.values(processedData.riskScores);
    const averageRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
    const highRiskCount = riskScores.filter(score => score >= 80).length;
    // Geographic analysis
    const pharmacyPrescriptions = recentPrescriptions.reduce((acc: any, p) => {
      acc[p.Pharmacy_ID] = (acc[p.Pharmacy_ID] || 0) + 1;
      return acc;
    }, {});
    const hotspotCount = Object.values(pharmacyPrescriptions).filter((count: any) => count > 100).length;
    return [{
      title: 'Prescription Pattern Analysis',
      insight: `${(controlledSubstanceRatio * 100).toFixed(1)}% of recent prescriptions are controlled substances${controlledSubstanceRatio > 0.4 ? ', indicating elevated risk' : ', within normal range'}`,
      type: controlledSubstanceRatio > 0.4 ? 'warning' : 'info',
      icon: <TrendingUpIcon className="h-5 w-5" />
    }, {
      title: 'Risk Assessment',
      insight: `${highRiskCount} prescribers show high-risk patterns, with average risk score of ${averageRisk.toFixed(1)}`,
      type: highRiskCount > 10 ? 'warning' : 'info',
      icon: <AlertCircleIcon className="h-5 w-5" />
    }, {
      title: 'Geographic Analysis',
      insight: `Identified ${hotspotCount} potential dispensing hotspots requiring review`,
      type: hotspotCount > 5 ? 'warning' : 'info',
      icon: <MapPinIcon className="h-5 w-5" />
    }, {
      title: 'AI Recommendation',
      insight: generateRecommendation(controlledSubstanceRatio, highRiskCount, hotspotCount),
      type: 'info',
      icon: <BrainCircuitIcon className="h-5 w-5" />
    }];
  };
  const generateRecommendation = (ratio: number, highRisk: number, hotspots: number) => {
    if (ratio > 0.4 && highRisk > 10) {
      return 'Immediate review recommended for high-risk prescribers and controlled substance patterns';
    } else if (hotspots > 5) {
      return 'Consider investigating geographic hotspots for unusual dispensing patterns';
    } else {
      return 'Continue monitoring - current patterns within expected ranges';
    }
  };
  const insights = generateInsights();
  return <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <BrainCircuitIcon className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-lg font-medium text-gray-900">
          AI-Powered Insights
        </h2>
      </div>
      <div className="space-y-4">
        {insights.map((insight, index) => <div key={index} className={`p-4 rounded-lg ${insight.type === 'warning' ? 'bg-red-50' : 'bg-blue-50'}`}>
            <div className="flex items-start">
              <div className={`${insight.type === 'warning' ? 'text-red-600' : 'text-blue-600'} mt-0.5`}>
                {insight.icon}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {insight.title}
                </h3>
                <p className={`mt-1 text-sm ${insight.type === 'warning' ? 'text-red-700' : 'text-blue-700'}`}>
                  {insight.insight}
                </p>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}