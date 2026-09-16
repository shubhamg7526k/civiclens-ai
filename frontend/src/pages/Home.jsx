import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="badge">✦ AI-POWERED CIVIC INTELLIGENCE</span>
          
          <h1>
            Turn civic problems into
            <br/>actionable reports.
          </h1>
          
          <p>
            CivicLens AI uses artificial intelligence to analyze photos of
            public infrastructure problems and turn them into structured,
            location-aware civic data for faster resolution.
          </p>
          
          <div className="hero-buttons">
            <Link to="/report" className="primary-btn">
              Report an Issue
            </Link>
            <Link to="/dashboard" className="secondary-btn">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;