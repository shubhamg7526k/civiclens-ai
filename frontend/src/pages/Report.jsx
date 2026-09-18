import ReportForm from "../components/ReportForm";

function Report() {
  return (
    <main className="page">
      <div className="report-container">
        <h1>Report a Civic Issue</h1>
        <p style={{ color: "#596275", marginBottom: "30px" }}>
          Upload a photo of a public infrastructure problem and let CivicLens AI analyze it automatically.
        </p>
        
        <ReportForm />
      </div>
    </main>
  );
}

export default Report;