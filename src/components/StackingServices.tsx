import { Link } from 'react-router-dom';
import './StackingServices.css';

import imgOrthodontics from '../assets/service_orthodontics.png';
import imgCosmetic     from '../assets/service_cosmetic.png';
import imgRestoration  from '../assets/service_restoration.png';
import imgPediatric    from '../assets/service_pediatric.png';

const SERVICES = [
  {
    num: '01',
    title: 'Orthodontics',
    image: imgOrthodontics,
    tagline: 'Correcting misaligned teeth and jaws to improve bite and appearance. Treatment is gradual and can take months to years.',
    steps: [
      'Initial consultation & X-rays',
      'Treatment planning (braces vs. aligners)',
      'Fitting of appliance (brackets, wires, or clear trays)',
      'Regular adjustment appointments (every 4–8 weeks)',
      'Removal & fitting of retainer',
    ],
    bgColor: '#f4f7fb' // Light blue-ish
  },
  {
    num: '02',
    title: 'Cosmetic Dentistry',
    image: imgCosmetic,
    tagline: "Improving the visual appearance of teeth — color, shape, or overall smile. It's elective, not medically necessary.",
    steps: [
      'Smile analysis & patient consultation',
      'Treatment selection (whitening / veneers / makeover)',
      'Tooth preparation if needed (e.g. enamel shaping for veneers)',
      'Application or bonding of material',
      'Final polish & review',
    ],
    bgColor: '#eef3fa' // Slightly darker blue-ish
  },
  {
    num: '03',
    title: 'Dental Restoration',
    image: imgRestoration,
    tagline: 'Repairing or replacing damaged or missing teeth to restore function. Covers fillings, crowns, bridges, and implants.',
    steps: [
      'Diagnosis (X-ray, clinical exam)',
      'Removal of decay or damaged tissue',
      'Selection of material (composite, ceramic, metal)',
      'Placement & shaping',
      'Bite check & final adjustment',
    ],
    bgColor: '#e8f0fb' // More saturated blue-ish
  },
  {
    num: '04',
    title: 'Pediatric Dentistry',
    image: imgPediatric,
    tagline: 'Dental care tailored specifically for children from infancy through adolescence. Focuses on prevention, education, and early intervention.',
    steps: [
      'First visit & child-friendly introduction',
      'Clinical exam + X-rays (age-appropriate)',
      'Cleaning & fluoride treatment',
      'Cavity detection & sealants if needed',
      'Parent guidance on diet & brushing habits',
    ],
    bgColor: '#d6e2f0' // Darkest blue-ish of the set
  },
];

export default function StackingServices() {
  return (
    <section className="svc-stack" id="services">
      {/* ── Intro Section ──────────────────────────────── */}
      <div className="svc-stack__header-section container">
        <span className="section-label">Our Services</span>
        <div className="divider svc-stack__divider" />
        <h2 className="section-title">
          Complete care for every smile.
        </h2>
        <p className="section-subtitle svc-stack__subtitle">
          From a simple polish to full smile restoration — we do it all under one roof.
        </p>
      </div>

      {/* ── Stacking Cards ─────────────────────────────── */}
      <div className="svc-stack__cards">
        {SERVICES.map((s, i) => (
          <div 
            key={i} 
            className="svc-stack__card" 
            style={{ backgroundColor: s.bgColor, zIndex: i + 1 }}
          >
            {/* Dot Matrix Background */}
            <div className="svc-stack__bg-pattern" />

            <div className="svc-stack__inner container">
              {/* Left: Content */}
              <div className="svc-stack__content">
                <span className="svc-stack__num">{s.num} / {SERVICES.length.toString().padStart(2, '0')}</span>
                <h3 className="svc-stack__title">{s.title}</h3>
                <p className="svc-stack__tagline">{s.tagline}</p>
                
                <ul className="svc-stack__steps">
                  {s.steps.map((step, j) => (
                    <li key={j} className="svc-stack__step">
                      <span className="svc-stack__step-num">{j + 1}</span>
                      {step}
                    </li>
                  ))}
                </ul>

                <div className="svc-stack__card-footer">
                  <Link to="/services" className="svc-stack__cta">
                    <span className="svc-stack__cta-text">Explore Service</span>
                    <div className="svc-stack__cta-icon-wrapper">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" strokeWidth="2.5" 
                        strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Right: Image */}
              <div className="svc-stack__img-wrap">
                <img src={s.image} alt={s.title} className="svc-stack__img" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
