import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
          <span className="navbar__logo-text">Dento</span>
        </Link>

        <div className="navbar__nav">
          <Link to="/" className="navbar__link">Home</Link>
          <Link to="/about" className="navbar__link">About Us</Link>
          <Link to="/services" className="navbar__link">Services</Link>
        </div>

        <Link to="/coming-soon" className="btn-shiny-wrap">
          <span className="btn--shiny">
            Contact
          </span>
        </Link>
      </div>
    </nav>
  );
}
