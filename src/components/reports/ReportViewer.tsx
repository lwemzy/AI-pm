import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
interface ReportViewerProps {
  reportType: string;
  dateRange: string;
  filterView: string;
}
export function ReportViewer({
  reportType,
  dateRange,
  filterView
}: ReportViewerProps) {
  const {
    prescriptions,
    processedData
  } = useData();
  const generateSummaryData = () => {
    const summary = {
      totalPrescriptions: processedData.totalPrescriptions,
      totalDoctors: processedData.totalDoctors,
      highRiskDoctors: Object.values(processedData.riskScores).filter(score => score >= 80).length,
      controlledSubstances: prescriptions.filter(p => ['Opioid', 'Stimulant', 'Sedative'].includes(p.Drug_Class)).length
    };
    return summary;
  };
  const generateComplianceData = () => {
    const riskLevels = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    Object.values(processedData.riskScores).forEach(score => {
      if (score >= 90) riskLevels.critical++;else if (score >= 70) riskLevels.high++;else if (score >= 50) riskLevels.medium++;else riskLevels.low++;
    });
    return [{
      name: 'Low Risk',
      value: riskLevels.low,
      fill: '#22c55e'
    }, {
      name: 'Medium Risk',
      value: riskLevels.medium,
      fill: '#eab308'
    }, {
      name: 'High Risk',
      value: riskLevels.high,
      fill: '#f97316'
    }, {
      name: 'Critical Risk',
      value: riskLevels.critical,
      fill: '#ef4444'
    }];
  };
  const generateTrendData = () => {
    const monthlyData = prescriptions.reduce((acc: any, prescription) => {
      const date = new Date(prescription.Prescription_Date);
      if (isNaN(date.getTime())) return acc;
      const monthKey = date.toLocaleString('default', {
        month: 'short',
        year: '2-digit'
      });
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          opioids: 0,
          stimulants: 0,
          sedatives: 0,
          totalRiskScore: 0,
          prescriptionCount: 0
        };
      }
      const drugClass = prescription.Drug_Class.toLowerCase();
      if (drugClass === 'opioid') acc[monthKey].opioids++;else if (drugClass === 'stimulant') acc[monthKey].stimulants++;else if (drugClass === 'sedative') acc[monthKey].sedatives++;
      acc[monthKey].totalRiskScore += processedData.riskScores[prescription.Doctor_ID] || 0;
      acc[monthKey].prescriptionCount++;
      return acc;
    }, {});
    return Object.values(monthlyData).map((data: any) => ({
      ...data,
      averageRiskScore: data.totalRiskScore / data.prescriptionCount
    }));
  };
  const generatePrescriberData = () => {
    const prescriberStats = prescriptions.reduce((acc: any, prescription) => {
      const doctorId = prescription.Doctor_ID;
      if (!acc[doctorId]) {
        acc[doctorId] = {
          id: doctorId,
          name: `Dr. ${doctorId}`,
          totalPrescriptions: 0,
          controlledSubstances: 0,
          riskScore: processedData.riskScores[doctorId] || 0
        };
      }
      acc[doctorId].totalPrescriptions++;
      if (['Opioid', 'Stimulant', 'Sedative'].includes(prescription.Drug_Class)) {
        acc[doctorId].controlledSubstances++;
      }
      return acc;
    }, {});
    return Object.values(prescriberStats).sort((a: any, b: any) => b.totalPrescriptions - a.totalPrescriptions).slice(0, 10);
  };
  const generateGeographicData = () => {
    const STATE_COORDINATES = {
      NY: {
        lat: 40.7128,
        lng: -74.006
      },
      CA: {
        lat: 36.7783,
        lng: -119.4179
      },
      TX: {
        lat: 31.9686,
        lng: -99.9018
      },
      FL: {
        lat: 27.6648,
        lng: -81.5158
      },
      IL: {
        lat: 41.8781,
        lng: -87.6298
      }
    };
    const locationData = prescriptions.reduce((acc: any, prescription) => {
      const pharmacyId = prescription.Pharmacy_ID;
      if (!acc[pharmacyId]) {
        const stateKeys = Object.keys(STATE_COORDINATES);
        const stateIndex = parseInt(pharmacyId.replace(/\D/g, '')) % stateKeys.length;
        const state = stateKeys[stateIndex];
        const coords = STATE_COORDINATES[state];
        const offset = 0.5;
        acc[pharmacyId] = {
          id: pharmacyId,
          name: `Pharmacy ${pharmacyId}`,
          lat: coords.lat + (Math.random() - 0.5) * offset,
          lng: coords.lng + (Math.random() - 0.5) * offset,
          prescriptions: 0,
          controlled: 0
        };
      }
      acc[pharmacyId].prescriptions++;
      if (['Opioid', 'Stimulant', 'Sedative'].includes(prescription.Drug_Class)) {
        acc[pharmacyId].controlled++;
      }
      return acc;
    }, {});
    return Object.values(locationData);
  };
  const renderReport = () => {
    switch (reportType) {
      case 'summary':
        const summaryData = generateSummaryData();
        return <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(summaryData).map(([key, value]) => <div key={key} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {value.toLocaleString()}
                  </p>
                </div>)}
            </div>
          </div>;
      case 'compliance':
        const complianceData = generateComplianceData();
        return <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Risk Level Distribution
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>;
      case 'trends':
        const trendData = generateTrendData();
        return <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Prescription Trends by Drug Class
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="opioids" stackId="1" stroke="#ef4444" fill="#fee2e2" />
                    <Area type="monotone" dataKey="stimulants" stackId="1" stroke="#f97316" fill="#ffedd5" />
                    <Area type="monotone" dataKey="sedatives" stackId="1" stroke="#6366f1" fill="#e0e7ff" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Average Risk Score Trend
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="averageRiskScore" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>;
      case 'prescriber':
        const prescriberData = generatePrescriberData();
        return <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Top 10 Prescribers by Volume
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prescriberData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalPrescriptions" name="Total Prescriptions" fill="#3b82f6" />
                    <Bar dataKey="controlledSubstances" name="Controlled Substances" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {prescriberData.map((prescriber: any) => <div key={prescriber.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {prescriber.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {prescriber.totalPrescriptions.toLocaleString()} total
                        prescriptions
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${prescriber.riskScore >= 80 ? 'bg-red-100 text-red-800' : prescriber.riskScore >= 60 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                      Risk: {Math.round(prescriber.riskScore)}
                    </span>
                  </div>
                </div>)}
            </div>
          </div>;
      case 'geographic':
        const locationData = generateGeographicData();
        return <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Geographic Distribution of Prescriptions
              </h3>
              <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
                <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{
                height: '100%',
                width: '100%'
              }} scrollWheelZoom={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                  {locationData.map((location: any) => <CircleMarker key={location.id} center={[location.lat, location.lng]} radius={Math.max(8, Math.min(15, location.prescriptions / 100))} pathOptions={{
                  fillColor: location.controlled / location.prescriptions >= 0.5 ? '#ef4444' : '#3b82f6',
                  fillOpacity: 0.7,
                  color: 'white',
                  weight: 1
                }}>
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-medium">{location.name}</h4>
                          <p className="text-sm text-gray-600">
                            Total Prescriptions: {location.prescriptions}
                          </p>
                          <p className="text-sm text-gray-600">
                            Controlled Substances: {location.controlled}
                          </p>
                        </div>
                      </Popup>
                    </CircleMarker>)}
                </MapContainer>
              </div>
            </div>
          </div>;
      default:
        return <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Select a report to view details</p>
            </div>
          </div>;
    }
  };
  return <div className="space-y-6">{renderReport()}</div>;
}