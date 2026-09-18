import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component that automatically fits the map to show all pins
function MapBounds({ reports }) {
  const map = useMap();
  useEffect(() => {
    if (reports.length > 0) {
      const bounds = L.latLngBounds(reports.map(r => [r.latitude, r.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [reports, map]);
  return null;
}

function MapView({ reports }) {
  const validReports = reports.filter(
    (r) => r.latitude !== null && r.longitude !== null
  );

  return (
    <div style={{ borderRadius: '15px', overflow: 'hidden', border: '1px solid #e4e8ef', marginTop: '10px' }}>
      <MapContainer
        center={[19.0760, 72.8777]} // Default fallback
        zoom={11}
        style={{ height: "450px", width: "100%", zIndex: 1 }}
      >
        {/* Bright, Colorful OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds reports={validReports} />

        {validReports.map((report) => (
          <Marker key={report.id} position={[report.latitude, report.longitude]}>
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', width: '200px' }}>
                <strong style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#0f172a' }}>
                  {report.issue_type}
                </strong>
                <span style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Severity: <strong style={{ color: '#dc2626' }}>{report.severity}</strong>
                </span>
                <span style={{ fontSize: '12px', color: '#475569', display: 'block' }}>
                  Status: <strong style={{ color: report.status === 'Resolved' ? '#16a34a' : '#2563eb' }}>{report.status}</strong>
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;