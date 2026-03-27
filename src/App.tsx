import { Suspense, lazy } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useScrollAnimations } from './lib/useScrollAnimations';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Briefcase, User, Info } from 'lucide-react';
import { NavBar } from './components/ui/TubelightNavbar';
import { Analytics } from '@vercel/analytics/react';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import './animations.css';

// ── Lazy-loaded page routes (each gets its own JS chunk) ──────────────────────
const HomePage    = lazy(() => import('./pages/Home'));
const About       = lazy(() => import('./pages/About'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const BookingPage  = lazy(() => import('./pages/BookingPage'));

// Simple page-level fallback
function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'var(--clr-text-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}>
        Loading…
      </span>
    </div>
  );
}

const navItems = [
  { name: 'Home',     url: '/',        icon: Home     },
  { name: 'Services', url: '/services', icon: Briefcase },
  { name: 'About',    url: '/about',    icon: Info     },
  { name: 'Book',     url: '/booking',  icon: User     },
];

export default function App() {
  useScrollAnimations();
  return (
    <HelmetProvider>
      <Helmet>
        <title>Dental of Valor | Premium Dental Care in Anderlecht, Brussels</title>
        <meta name="description" content="Dental of Valor in Anderlecht – expert dental care for the whole family. General dentistry, implants, whitening, orthodontics, and more. Book your appointment today." />
        <meta name="keywords" content="dental clinic Anderlecht, dentist Brussels, teeth whitening, dental implants, orthodontics, cosmetic dentistry, Dental of Valor" />
        <meta property="og:title" content="Dental of Valor | Premium Dental Care in Anderlecht, Brussels" />
        <meta property="og:description" content="Expert dental care for the whole family in Anderlecht. Book your appointment today." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.dentalofvalor.be/" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Dentist",
            "name": "Dental of Valor",
            "url": "https://www.dentalofvalor.be",
            "telephone": "+3225205232",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Rue de Formanoir 9",
              "addressLocality": "Anderlecht",
              "postalCode": "1070",
              "addressCountry": "BE"
            },
            "openingHours": [
              "Mo-We 09:00-18:30",
              "Th 09:00-18:00",
              "Fr 09:00-18:30",
              "Sa 09:00-15:00"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "40"
            }
          }
        `}</script>
      </Helmet>

      <BrowserRouter>
        <ScrollToTop />
        <NavBar items={navItems} />

        <main id="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"        element={<HomePage />} />
              <Route path="/about"   element={<About />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/booking" element={<BookingPage />} />
              {/* Catch-all redirects to home */}
              <Route path="*"        element={<HomePage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </BrowserRouter>

      {/* Vercel Analytics — automatically tracks page views */}
      <Analytics />
    </HelmetProvider>
  );
}

