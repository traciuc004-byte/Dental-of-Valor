import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__inner">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-title">Dental of Valor</span>
            </div>
            <p className="footer__brand-desc">
              Providing expert, compassionate dental care in Anderlecht.
              Your smile is our mission.
            </p>
            <div className="footer__socials" aria-label="Social media links">
              {/* Facebook */}
              <a href="https://facebook.com/dentalofvalor" className="footer__social" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/dentalofvalor" className="footer__social" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com/company/dentalofvalor" className="footer__social" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Footer services">
            <p className="footer__col-title">Services</p>
            <ul className="footer__links">
              {[
                { name: 'Orthodontics', path: '/services' },
                { name: 'Cosmetic Dentistry', path: '/services' },
                { name: 'Dental Restoration', path: '/services' },
                { name: 'Pediatric Dentistry', path: '/services' }
              ].map(s => (
                <li key={s.name}><Link to={s.path} className="footer__link">{s.name}</Link></li>
              ))}
            </ul>
          </nav>

          {/* Quick Links */}
          <nav aria-label="Footer quick links">
            <p className="footer__col-title">Quick Links</p>
            <ul className="footer__links">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Book Appointment', path: '/booking' }
              ].map(l => (
                <li key={l.name}><Link to={l.path} className="footer__link">{l.name}</Link></li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address style={{ fontStyle: 'normal' }}>
            <p className="footer__col-title">Contact</p>
            <div className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Rue de Formanoir 9<br />1070 Anderlecht, Belgium</span>
            </div>
            <div className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <a href="tel:+3225205232">+32 2 520 52 32</a>
            </div>
            <div className="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href="mailto:info@dentalofvalor.be">info@dentalofvalor.be</a>
            </div>

            <div className="footer__hours" aria-label="Opening hours">
              {[
                ['Mon – Wed', '09:00 – 18:30'],
                ['Thursday', '09:00 – 18:00'],
                ['Friday', '09:00 – 18:30'],
                ['Saturday', '09:00 – 15:00'],
                ['Sunday', 'Closed'],
              ].map(([day, hrs]) => (
                <div key={day} className="footer__hours-row">
                  <span>{day}</span>
                  <span>{hrs}</span>
                </div>
              ))}
            </div>
          </address>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom" style={{ justifyContent: 'center' }}>
          <p>© {currentYear} Dental of Valor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
