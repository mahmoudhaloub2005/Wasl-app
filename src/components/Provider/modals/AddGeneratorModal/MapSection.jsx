
import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapSection.css';

const MapSection = () => {
  const defaultPosition = [33.3152, 44.3661]; // بغداد كمثال افتراضي

  return (
    <div className="map-section-container">
      <div className="map-header-label">
        <span>🗺️</span>
        <div>
          <h4>الخريطة</h4>
          <p>حدد موقع المولد بدقة على الخريطة</p>
        </div>
      </div>
      
      <div className="leaflet-map-wrapper">
        <MapContainer center={defaultPosition} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={defaultPosition}></Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapSection;
