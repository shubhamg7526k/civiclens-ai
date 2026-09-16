import { useEffect, useState } from "react";
import { getReports } from "../api";

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data || []);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to assign CSS classes based on severity
  const getSeverityClass = (severity) => {
    if (!severity) return "";
    const s = severity.toLowerCase();
    if (s.includes("critical")) return "badge-critical";
    if (s.includes("high")) return "badge-high";
    return "badge-medium";
  };

  const total = reports.length;
  const critical = reports.filter(r => r.severity?.toLowerCase().includes("critical")).length;
  const pending = reports.filter(r => r.status?.toLowerCase() === "pending").length;

  return (
    <div className="dashboard">
      <div>
        <h1 style={{ marginBottom: "5px" }}>Civic Intelligence Dashboard</h1>
        <p style={{ color: "#687286", marginTop: "0" }}>Monitor and analyze reported infrastructure issues in real-time.</p>
      </div>

      <div className="stats">
        <div className="stat">
          <span>Total Reports</span>
          <strong>{total}</strong>
        </div>
        <div className="stat">
          <span>Critical Issues</span>
          <strong style={{ color: "#d32f2f" }}>{critical}</strong>
        </div>
        <div className="stat">
          <span>Pending Fixes</span>
          <strong>{pending}</strong>
        </div>
        <div className="stat" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <button className="secondary-btn" onClick={loadReports} disabled={loading}>
             {loading ? "Refreshing..." : "Refresh Data"}
           </button>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Recent Reports</h2>
        
        {loading ? (
          <p style={{ color: "#687286" }}>Loading reports...</p>
        ) : reports.length === 0 ? (
          <div className="report-card" style={{ textAlign: "center", padding: "40px" }}>
            <h3 style={{ margin: 0 }}>No reports yet</h3>
            <p style={{ color: "#687286" }}>Reports submitted through CivicLens will appear here.</p>
          </div>
        ) : (
          <div className="reports">
            {reports.map((report) => (
              <div className="report-card" key={report.id}>
                <div className="report-header">
                  <h3>{report.issue_type || "Unknown Issue"}</h3>
                  <span className={`severity ${getSeverityClass(report.severity)}`}>
                    {report.severity || "Unknown"}
                  </span>
                </div>
                
                <p style={{ color: "#596275", fontSize: "14px", lineHeight: "1.5" }}>
                  {report.description}
                </p>
                
                <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e4e8ef", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#687286" }}>
                    ID: #{report.id}
                  </span>
                  <span className={`severity ${report.status?.toLowerCase() === 'resolved' ? 'status-resolved' : 'status-pending'}`}>
                    {report.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;