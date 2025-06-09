import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
interface PharmaciesMapProps {
  onSelectPharmacy: (id: string) => void;
}
export function PharmaciesMap({
  onSelectPharmacy
}: PharmaciesMapProps) {
  const pharmacies = [{
    id: 'PH001',
    name: 'Central City Pharmacy',
    location: 'New York, NY',
    lat: 40.7128,
    lng: -74.006,
    riskScore: 92
  }, {
    id: 'PH002',
    name: 'Westside Health Pharmacy',
    location: 'Los Angeles, CA',
    lat: 34.0522,
    lng: -118.2437,
    riskScore: 45
  }, {
    id: 'PH003',
    name: 'Metro Medical Pharmacy',
    location: 'Chicago, IL',
    lat: 41.8781,
    lng: -87.6298,
    riskScore: 78
  }];
  const getRiskColor = (score: number) => {
    if (score >= 80) return '#ef4444';
    if (score >= 60) return '#f97316';
    return '#22c55e';
  };
  return <div className="h-[600px] rounded-lg overflow-hidden">
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{
      height: '100%',
      width: '100%'
    }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
        {pharmacies.map(pharmacy => <CircleMarker key={pharmacy.id} center={[pharmacy.lat, pharmacy.lng]} radius={10} pathOptions={{
        fillColor: getRiskColor(pharmacy.riskScore),
        fillOpacity: 0.7,
        color: 'white',
        weight: 1
      }} eventHandlers={{
        click: () => onSelectPharmacy(pharmacy.id)
      }}>
            <Popup>
              <div className="p-2">
                <h3 className="font-medium">{pharmacy.name}</h3>
                <p className="text-sm text-gray-600">{pharmacy.location}</p>
                <p className="text-sm text-gray-600">
                  Risk Score: {pharmacy.riskScore}
                </p>
                <button onClick={() => onSelectPharmacy(pharmacy.id)} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                  View Details →
                </button>
              </div>
            </Popup>
          </CircleMarker>)}
      </MapContainer>
    </div>;
}