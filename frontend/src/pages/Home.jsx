import { Link } from "react-router-dom";
import heroBg from "../assets/hero-bg.png";

function Home() {
  return (
    <section 
      className="hero"
      style={{
        minHeight: 'calc(100vh - 80px)',
        backgroundColor: '#FFFFFF',
        backgroundImage: `url(${heroBg})`,
        backgroundPosition: '8% center', // Creates a comfortable margin from the left border
        backgroundRepeat: 'no-repeat',
        backgroundSize: '45%', // Prevents the image from overlapping the text card
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end', // Keeps the text pushed to the right
        padding: '0 8%' // Adds margin to the right side of the screen
      }}
    >
      <div 
        className="hero-content"
        style={{ 
          maxWidth: '600px', 
          padding: '40px', 
          background: 'rgba(255, 255, 255, 0.9)', // Slight transparency
          borderRadius: '16px',
          backdropFilter: 'blur(8px)',
          border: '1px solid #e2e8f0', // Clean border framing the text
          textAlign: 'left'
        }}
      >
        <span 
          className="badge" 
          style={{ 
            display: 'inline-block', 
            padding: '6px 12px', 
            background: '#eef2ff', 
            color: '#4f46e5', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: 'bold', 
            letterSpacing: '1px', 
            marginBottom: '20px' 
          }}
        >
          ✦ AI-POWERED CIVIC INTELLIGENCE
        </span>
        
        <h1 style={{ fontSize: '48px', color: '#0f172a', margin: '0 0 20px', lineHeight: '1.2', fontWeight: '800' }}>
          Turn civic problems into
          <br/>actionable reports.
        </h1>
        
        <p style={{ fontSize: '18px', color: '#475569', marginBottom: '35px', lineHeight: '1.6' }}>
          CivicLens AI uses artificial intelligence to analyze photos of
          public infrastructure problems and turn them into structured,
          location-aware civic data for faster resolution.
        </p>
        
        <div className="hero-buttons" style={{ display: 'flex', gap: '15px' }}>
          <Link 
            to="/report" 
            className="primary-btn"
            style={{
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              background: '#2563eb',
              color: 'white'
            }}
          >
            Report an Issue
          </Link>
          <Link 
            to="/dashboard" 
            className="secondary-btn"
            style={{
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              background: 'transparent',
              color: '#0f172a',
              border: '2px solid #cbd5e1'
            }}
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;