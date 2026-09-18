import { useEffect, useState } from "react";
import { getReports, updateReportStatus, deleteReport } from "../api";
import MapView from "../components/MapView";

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

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Resolved" : "Pending";
    try {
      await updateReportStatus(id, newStatus);
      loadReports(); 
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await deleteReport(id);
      loadReports(); 
    } catch (e) {
      console.error(e);
      alert("Failed to delete report");
    }
  };

  const handleDispatch = (report) => {
    const to = "publicworks@mumbai.gov.in";
    const subject = encodeURIComponent(`URGENT: ${report.severity} Infrastructure Issue - ${report.issue_type}`);
    
    // Round coordinates to 6 decimal places for a cleaner look
    const lat = report.latitude ? parseFloat(report.latitude).toFixed(6) : "N/A";
    const lng = report.longitude ? parseFloat(report.longitude).toFixed(6) : "N/A";

    // Enterprise Plain Text Layout
    const body = encodeURIComponent(`🚨 CIVICLENS AI: AUTOMATED DISPATCH TICKET 🚨
======================================================
TRACKING ID    : #${report.id}
PRIORITY LEVEL : ${report.severity ? report.severity.toUpperCase() : "UNKNOWN"}
ISSUE TYPE     : ${report.issue_type}
COORDINATES    : ${lat}, ${lng}
======================================================

[ AI TECHNICAL ASSESSMENT ]
${report.description}

[ RECOMMENDED ACTION ]
${report.suggested_action}

------------------------------------------------------
📎 PROOF OF DAMAGE:
Please review the attached image file for visual verification.
------------------------------------------------------

* View live GIS telemetry for this incident on the CivicLens dashboard.`);
    
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
    window.open(gmailLink, "_blank");
  };

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
  const resolved = reports.filter(r => r.status?.toLowerCase() === "resolved").length;

  // ========================================================
  // GET OWNED REPORTS: Read browser storage to determine ownership
  // ========================================================
  const myReports = JSON.parse(localStorage.getItem("my_civic_reports") || "[]");

  return (
    <div className="dashboard">
      <div>
        <p style={{ color: "#64748b", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", margin: "0 0 5px" }}>
          DEPARTMENT OF PUBLIC WORKS
        </p>
        <h1 style={{ margin: "0 0 5px", fontSize: "28px" }}>Civic Intelligence Dashboard</h1>
        <p style={{ color: "#64748b", margin: 0 }}>Live telemetry and incident dispatch queue.</p>
      </div>

      <div className="stats">
        <div className="stat">
          <span>Total Reports</span>
          <strong>{total}</strong>
        </div>
        <div className="stat">
          <span>Critical Issues</span>
          <strong style={{ color: "#dc2626" }}>{critical}</strong>
        </div>
        <div className="stat">
          <span>Pending Fixes</span>
          <strong style={{ color: "#2563eb" }}>{pending}</strong>
        </div>
        <div className="stat">
          <span>Resolved</span>
          <strong style={{ color: "#16a34a" }}>{resolved}</strong>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
        
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h2 style={{ fontSize: "16px", margin: 0 }}>GIS Geospatial Telemetry</h2>
            <button onClick={loadReports} style={{ padding: "6px 12px", fontSize: "12px" }}>Refresh Map</button>
          </div>
          <MapView reports={reports} />
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", maxHeight: "550px", overflowY: "auto" }}>
          <h2 style={{ fontSize: "16px", margin: "0 0 20px" }}>Recent Reports Feed</h2>
          
          {loading ? (
            <p style={{ color: "#64748b" }}>Loading reports...</p>
          ) : reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "#64748b" }}>No reports detected in the system.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {reports.map((report) => (
                <div key={report.id} style={{ padding: "16px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                  
                  {/* UPGRADED BOLD HEADINGS */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: "#0f172a", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      {report.issue_type || "Unknown Issue"}
                    </h3>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: "#475569", background: "#e2e8f0", padding: "3px 8px", borderRadius: "4px" }}>
                      ID: #{report.id}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: "13px", fontWeight: "500", color: "#334155", margin: "0 0 12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {report.description}
                  </p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <span className={`severity ${getSeverityClass(report.severity)}`}>
                        {report.severity || "Unknown"}
                      </span>
                      <span className={`severity ${report.status?.toLowerCase() === 'resolved' ? 'status-resolved' : 'status-pending'}`}>
                        {report.status || "Pending"}
                      </span>
                    </div>
                    
                    {/* CONDITIONAL RENDER: ONLY SHOW BUTTONS IF OWNED BY THIS BROWSER */}
                    {myReports.includes(report.id) ? (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button 
                          onClick={() => handleDispatch(report)}
                          style={{ padding: "6px 10px", fontSize: "11px", fontWeight: "600", color: "white", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", cursor: "pointer", transition: "opacity 0.2s" }}
                          onMouseOver={(e) => e.target.style.opacity = 0.8}
                          onMouseOut={(e) => e.target.style.opacity = 1}
                        >
                          ✉️ Dispatch
                        </button>

                        <button 
                          onClick={() => handleStatusChange(report.id, report.status)}
                          style={{ padding: "6px 10px", fontSize: "11px", fontWeight: "600", color: "white", border: "none", background: report.status === "Pending" ? "#16a34a" : "#64748b", borderRadius: "6px", cursor: "pointer", transition: "opacity 0.2s" }}
                          onMouseOver={(e) => e.target.style.opacity = 0.8}
                          onMouseOut={(e) => e.target.style.opacity = 1}
                        >
                          {report.status === "Pending" ? "✓ Resolve" : "↺ Reopen"}
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(report.id)}
                          style={{ padding: "6px 10px", fontSize: "11px", fontWeight: "600", color: "white", border: "none", background: "#dc2626", borderRadius: "6px", cursor: "pointer", transition: "opacity 0.2s" }}
                          onMouseOver={(e) => e.target.style.opacity = 0.8}
                          onMouseOut={(e) => e.target.style.opacity = 1}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic", padding: "6px 0" }}>
                        Public Report (View Only)
                      </span>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;