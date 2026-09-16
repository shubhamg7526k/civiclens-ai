import { useState } from "react";
import { submitReport } from "../api";

function ReportForm() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Helper function to assign CSS classes based on severity
  const getSeverityClass = (severity) => {
    if (!severity) return "badge-medium";
    const s = severity.toLowerCase();
    if (s.includes("critical")) return "badge-critical";
    if (s.includes("high")) return "badge-high";
    return "badge-medium";
  };

  function getLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: null, longitude: null });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          resolve({ latitude: null, longitude: null });
        }
      );
    });
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // Clear previous results
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);
    try {
      const location = await getLocation();
      const data = await submitReport(image, location.latitude, location.longitude);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while communicating with the AI.");
    }
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Custom Image Upload Area */}
        <div style={{ position: 'relative', border: '2px dashed #dce1ea', borderRadius: '12px', padding: previewUrl ? '10px' : '40px 20px', textAlign: 'center', background: '#fafbfc', cursor: 'pointer', transition: 'all 0.3s' }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
          />
          
          {previewUrl ? (
            <div>
              <img src={previewUrl} alt="Preview" style={{ maxHeight: '300px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }} />
              <p style={{ margin: '10px 0 0', color: '#596275', fontSize: '14px' }}>Click or drag to change image</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📸</div>
              <h3 style={{ margin: '0 0 5px' }}>Click to upload a photo</h3>
              <p style={{ margin: 0, color: '#596275', fontSize: '14px' }}>PNG, JPG, or JPEG (Max 5MB)</p>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="primary-btn" 
          disabled={loading || !image}
          style={{ opacity: (loading || !image) ? 0.6 : 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
        >
          {loading ? (
            <>
              <span className="spinner">⏳</span> AI Analyzing Infrastructure...
            </>
          ) : (
            "Analyze Issue"
          )}
        </button>
      </form>

      {/* AI Result Card */}
      {result && (
        <div className="result-card" style={{ marginTop: '30px', animation: 'fadeIn 0.5s ease-in' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <h2 style={{ margin: 0 }}>{result.issue_type}</h2>
            <span className={`severity ${getSeverityClass(result.severity)}`}>
              {result.severity}
            </span>
          </div>

          <p style={{ color: '#596275', lineHeight: '1.6', margin: '0 0 20px' }}>
            {result.description}
          </p>

          <div style={{ background: 'white', padding: '15px', borderRadius: '10px', border: '1px solid #e7eaf0' }}>
            <h4 style={{ margin: '0 0 10px', color: '#172033', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛠️ Recommended Action
            </h4>
            <p style={{ margin: 0, color: '#596275', fontSize: '14px' }}>
              {result.suggested_action}
            </p>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #dce1ea', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#687286' }}>
            <span>Report ID: #{result.id}</span>
            <span>AI Confidence: {(result.confidence * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportForm;