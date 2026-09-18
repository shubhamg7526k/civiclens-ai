import { NavLink } from "react-router-dom";
// 1. Import your downloaded logo image here
import logoImage from "../assets/logo.png"; 

function Navbar() {
  // Inline styles for active vs inactive links
  const navStyle = ({ isActive }) => ({
    color: isActive ? "#172033" : "#687286",
    borderBottom: isActive ? "2px solid #172033" : "2px solid transparent",
    paddingBottom: "22px", // Pushes the border to the bottom of the navbar
    transition: "all 0.2s ease"
  });

  return (
    <nav className="navbar">
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* 2. Replaced the text star with your actual image file */}
        <img 
          src={logoImage} 
          alt="CivicLens Logo" 
          style={{ height: "32px", width: "auto", objectFit: "contain" }} 
        />
        <span style={{ fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
          CivicLens
        </span>
      </div>

      <div className="nav-links" style={{ height: '100%', alignItems: 'flex-end' }}>
        <NavLink to="/" style={navStyle} end>
          Home
        </NavLink>
        <NavLink to="/report" style={navStyle}>
          Report Issue
        </NavLink>
        <NavLink to="/dashboard" style={navStyle}>
          Dashboard
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;