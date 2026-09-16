import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icons not showing in React properly
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapView({ reports }) {
  // Filter out reports that don't have valid GPS coordinates
  const validReports = reports.filter(
    (r) => r.latitude !== null && r.longitude !== null
  );

  return (
    <div style={{ borderRadius: '15px', overflow: 'hidden', border: '1px solid #e4e8ef', marginTop: '30px' }}>
      <MapContainer
        center={[19.0760, 72.8777]} // Centered on Mumbai
        zoom={11}
        style={{ height: "450px", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validReports.map((report) => (
          <Marker key={report.id} position={[report.latitude, report.longitude]}>
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>
                  {report.issue_type}
                </strong>
                <span style={{ fontSize: '12px', color: '#596275' }}>
                  Severity: <strong>{report.severity}</strong>
                </span>
                <br />
                <span style={{ fontSize: '12px', color: '#596275' }}>
                  Status: <strong>{report.status}</strong>
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