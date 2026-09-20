import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define a custom Blue Icon for RESOLVED issues
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Define a custom Red Icon for PENDING (Unresolved) issues
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapView({ reports }) {
  // Center the map on the first report, or default to Mumbai (19.0760, 72.8777)
  const defaultCenter = [19.0760, 72.8777];
  const center = reports.length > 0 && reports[0].latitude 
    ? [parseFloat(reports[0].latitude), parseFloat(reports[0].longitude)] 
    : defaultCenter;

  return (
    <MapContainer 
      center={center} 
      zoom={11} 
      style={{ height: '500px', width: '100%', borderRadius: '8px', zIndex: 1 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {reports.map((report) => {
        // Skip rendering if coordinates are missing
        if (!report.latitude || !report.longitude) return null;
        
        // Determine if the issue is resolved to set the correct icon color
        const isResolved = report.status?.toLowerCase() === 'resolved';

        return (
          <Marker 
            key={report.id} 
            position={[parseFloat(report.latitude), parseFloat(report.longitude)]}
            icon={isResolved ? blueIcon : redIcon}
          >
            <Popup>
              <div style={{ padding: '5px' }}>
                <strong style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>
                  {report.issue_type}
                </strong>
                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                  <strong>ID:</strong> #{report.id}<br/>
                  <strong>Priority:</strong> {report.severity}<br/>
                  <strong>Status: </strong> 
                  <span style={{ color: isResolved ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                    {report.status}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapView;