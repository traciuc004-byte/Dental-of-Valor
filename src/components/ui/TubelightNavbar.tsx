import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import './TubelightNavbar.css';

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className = '' }: NavBarProps) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    items.find((item) => item.url === location.pathname)?.name || items[0].name
  );
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  // Sync active tab on route change
  useEffect(() => {
    const current = items.find((item) => item.url === location.pathname);
    if (current) setActiveTab(current.name);
    setMobileOpen(false); // close drawer on navigation
  }, [location.pathname, items]);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Separate the "Book" item from regular nav items
  const bookItem   = items.find((i) => i.url === '/booking');
  const navItems   = items.filter((i) => i.url !== '/booking');

  return (
    <>
      <header className={`tl-navbar-wrapper ${scrolled ? 'tl-navbar-wrapper--scrolled' : ''} ${className}`}>

        {/* ── Logo ── */}
        <Link to="/" className="tl-logo" onClick={() => setActiveTab(items[0].name)}>
          <span className="tl-logo__name">Dental of Valor</span>
        </Link>

        {/* ── Centre pill nav ── */}
        <nav className="tl-navbar" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon     = item.icon;
            const isActive = activeTab === item.name;

            return (
              <Link
                key={item.name}
                to={item.url}
                onClick={() => setActiveTab(item.name)}
                className={`tl-nav-item ${isActive ? 'tl-nav-item--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="tl-nav-item__text">{item.name}</span>
                <span className="tl-nav-item__icon">
                  <Icon size={17} strokeWidth={2.5} />
                </span>

                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="tl-lamp-bg"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  >
                    <div className="tl-lamp-glow-bar">
                      <div className="tl-lamp-glow-blur tl-lamp-glow-blur--large" />
                      <div className="tl-lamp-glow-blur tl-lamp-glow-blur--medium" />
                      <div className="tl-lamp-glow-blur tl-lamp-glow-blur--small" />
                    </div>
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: Book Now + hamburger ── */}
        <div className="tl-right">
          {bookItem && (
            <Link
              to={bookItem.url}
              className="tl-book-btn"
              onClick={() => setActiveTab(bookItem.name)}
            >
              Book Now
            </Link>
          )}

          {/* Hamburger (mobile only) */}
          <button
            className="tl-hamburger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span
              className="tl-hamburger__bar"
              style={mobileOpen ? { transform: 'translateY(7px) rotate(45deg)' } : {}}
            />
            <span
              className="tl-hamburger__bar"
              style={mobileOpen ? { opacity: 0 } : {}}
            />
            <span
              className="tl-hamburger__bar"
              style={mobileOpen ? { transform: 'translateY(-7px) rotate(-45deg)' } : {}}
            />
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <nav className="tl-mobile-menu" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const Icon     = item.icon;
            const isActive = activeTab === item.name;
            return (
              <Link
                key={item.name}
                to={item.url}
                className={`tl-mobile-link ${isActive ? 'tl-mobile-link--active' : ''}`}
                onClick={() => { setActiveTab(item.name); setMobileOpen(false); }}
              >
                <Icon size={16} strokeWidth={2} />
                {item.name}
              </Link>
            );
          })}
          <div className="tl-mobile-divider" />
          {bookItem && (
            <Link
              to={bookItem.url}
              className="tl-mobile-book"
              onClick={() => { setActiveTab(bookItem.name); setMobileOpen(false); }}
            >
              Book Now
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
