import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>⚡ AI Quiz Generator</Link>

        <button className="mobile-menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          {!user ? (
            <>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</NavLink>
              <NavLink to="/#how-it-works" className="nav-link" onClick={() => setMenuOpen(false)}>How It Works</NavLink>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className="btn btn-primary nav-cta" onClick={() => setMenuOpen(false)}>Register</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
              <NavLink to="/generate" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Generate</NavLink>
              <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>History</NavLink>
              <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Profile</NavLink>
              <button className="btn btn-outline nav-logout" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
