import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import moravianData from '../data/moravian.json';
import lehighData from '../data/lehigh.json';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  university: string;
}

const MapView: React.FC<MapViewProps> = ({ university }) => {
  const data = university === 'Moravian' ? moravianData : lehighData;

  return (
    <div className="map-container">
      <MapContainer center={data.center} zoom={16} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          attribution='© OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.buildings.map((b) => (
          <Marker key={b.name} position={b.coords}>
            <Popup>
              <strong>{b.name}</strong><br />
              Availability: {b.availability}<br />
              Sound: {b.soundLevel}<br />
              Wi-Fi: {b.wifi}<br />
              Comfort: {b.comfort}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
