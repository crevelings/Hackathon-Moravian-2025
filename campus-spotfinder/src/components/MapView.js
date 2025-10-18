import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import moravianData from '../data/moravian.json';
import lehighData from '../data/lehigh.json';

// Fix default marker icon path
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapView = ({ university }) => {
  const data = university === 'Moravian' ? moravianData : lehighData;

  return (
    <div className="map-container">
      <MapContainer center={data.center} zoom={16} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          attribution='© OpenStreetMap contributors'
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
