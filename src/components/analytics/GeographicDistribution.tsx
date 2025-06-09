import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useData } from '../context/DataContext';
import 'leaflet/dist/leaflet.css';
const STATE_COORDINATES = {
  NY: {
    lat: 40.7128,
    lng: -74.006,
    name: 'New York'
  },
  CA: {
    lat: 36.7783,
    lng: -119.4179,
    name: 'California'
  },
  TX: {
    lat: 31.9686,
    lng: -99.9018,
    name: 'Texas'
  },
  FL: {
    lat: 27.6648,
    lng: -81.5158,
    name: 'Florida'
  },
  IL: {
    lat: 41.8781,
    lng: -87.6298,
    name: 'Illinois'
  },
  PA: {
    lat: 41.2033,
    lng: -77.1945,
    name: 'Pennsylvania'
  },
  OH: {
    lat: 40.4173,
    lng: -82.9071,
    name: 'Ohio'
  },
  MI: {
    lat: 44.3148,
    lng: -85.6024,
    name: 'Michigan'
  },
  GA: {
    lat: 33.749,
    lng: -84.388,
    name: 'Georgia'
  },
  NC: {
    lat: 35.7596,
    lng: -79.0193,
    name: 'North Carolina'
  }
};
export function GeographicDistribution() {
  const {
    prescriptions
  } = useData();
  const pharmacyData = prescriptions.reduce((acc: any, prescription) => {
    const id = prescription.Pharmacy_ID;
    if (!acc[id]) {
      const stateKeys = Object.keys(STATE_COORDINATES);
      const stateIndex = parseInt(id.replace(/\D/g, '')) % stateKeys.length;
      const state = stateKeys[stateIndex];
      const baseCoords = STATE_COORDINATES[state];
      const offset = 0.5;
      const randomLat = baseCoords.lat + (Math.random() - 0.5) * offset;
      const randomLng = baseCoords.lng + (Math.random() - 0.5) * offset;
      acc[id] = {
        id,
        name: `Pharmacy ${id}`,
        state: STATE_COORDINATES[state].name,
        totalPrescriptions: 0,
        controlledSubstances: 0,
        lat: randomLat,
        lng: randomLng
      };
    }
    acc[id].totalPrescriptions++;
    if (['Opioid', 'Stimulant', 'Sedative'].includes(prescription.Drug_Class)) {
      acc[id].controlledSubstances++;
    }
    return acc;
  }, {});
  const locations = Object.values(pharmacyData).map((pharmacy: any) => ({
    ...pharmacy,
    riskScore: Math.round(pharmacy.controlledSubstances / pharmacy.totalPrescriptions * 100)
  }));
  const getRiskColor = (risk: number) => {
    if (risk >= 90) return '#ef4444';
    if (risk >= 70) return '#f97316';
    if (risk >= 50) return '#eab308';
    return '#22c55e';
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-end space-x-4">
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-[#22c55e]"></span>
          <span className="text-sm text-gray-600">Low Risk (&lt;50%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-[#eab308]"></span>
          <span className="text-sm text-gray-600">Medium Risk (50-69%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-[#f97316]"></span>
          <span className="text-sm text-gray-600">High Risk (70-89%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-[#ef4444]"></span>
          <span className="text-sm text-gray-600">Critical Risk (≥90%)</span>
        </div>
      </div>
      <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
        <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{
        height: '100%',
        width: '100%'
      }} scrollWheelZoom={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          {locations.map(location => <CircleMarker key={location.id} center={[location.lat, location.lng]} radius={Math.max(8, Math.min(15, location.totalPrescriptions / 100))} pathOptions={{
          fillColor: getRiskColor(location.riskScore),
          fillOpacity: 0.7,
          color: 'white',
          weight: 1
        }}>
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-medium text-gray-900">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.state}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Risk Score:</span>{' '}
                      <span className={`${location.riskScore >= 70 ? 'text-red-600' : 'text-gray-900'}`}>
                        {location.riskScore}%
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Total Prescriptions:</span>{' '}
                      {location.totalPrescriptions.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">
                        Controlled Substances:
                      </span>{' '}
                      {location.controlledSubstances.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>)}
        </MapContainer>
      </div>
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Analysis:</span> Identified{' '}
          {locations.filter(l => l.riskScore >= 70).length} high-risk areas
          across {Object.keys(STATE_COORDINATES).length} states. Areas with
          larger circles indicate higher prescription volumes.
        </p>
      </div>
    </div>;
}