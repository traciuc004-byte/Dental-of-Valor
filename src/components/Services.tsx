/**
 * Services — Scroll-Pinned Section
 * ──────────────────────────────────
 * Architecture:
 *   • ONE source of truth: scroll progress → active index. Nothing else writes to it.
 *   • onUpdate does ONE thing: compute index from progress. No scrollToIndex inside.
 *   • No wheel interception. Lenis handles smooth scrolling globally.
 *   • Clicks use getLenis().scrollTo() so they play nicely with the Lenis proxy.
 *   • Equal scroll zones: progress divided into N equal bands via Math.floor.
 *   • Section height: N * 100vh so each service gets exactly 100vh of scroll distance.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { getLenis } from '../lib/useScrollAnimations';
import './Services.css';

import imgOrthodontics from '../assets/service_orthodontics.png';
import imgCosmetic     from '../assets/service_cosmetic.png';
import imgRestoration  from '../assets/service_restoration.png';
import imgPediatric    from '../assets/service_pediatric.png';
import specialist1     from '../assets/specialist_1.png';
import specialist2     from '../assets/specialist_2.png';
import specialist3     from '../assets/specialist_3.png';

gsap.registerPlugin(ScrollTrigger);

const SPECIALISTS = [specialist1, specialist2, specialist3];

const SERVICES = [
  {
    num: '01',
    title: 'Orthodontics',
    subtitle: 'Braces, Aligners, Retainers',
    image: imgOrthodontics,
    tagline:
      'Correcting misaligned teeth and jaws to improve bite and appearance. Treatment is gradual and can take months to years.',
    steps: [
      'Initial consultation & X-rays',
      'Treatment planning (braces vs. aligners)',
      'Fitting of appliance (brackets, wires, or clear trays)',
      'Regular adjustment appointments (every 4–8 weeks)',
      'Removal & fitting of retainer',
    ],
  },
  {
    num: '02',
    title: 'Cosmetic Dentistry',
    subtitle: 'Teeth Whitening, Veneers, Smile Makeovers',
    image: imgCosmetic,
    tagline:
      "Improving the visual appearance of teeth — color, shape, or overall smile. It's elective, not medically necessary.",
    steps: [
      'Smile analysis & patient consultation',
      'Treatment selection (whitening / veneers / makeover)',
      'Tooth preparation if needed (e.g. enamel shaping for veneers)',
      'Application or bonding of material',
      'Final polish & review',
    ],
  },
  {
    num: '03',
    title: 'Dental Restoration',
    subtitle: 'Fillings, Crowns, Bridges, Implants',
    image: imgRestoration,
    tagline:
      'Repairing or replacing damaged or missing teeth to restore function. Covers fillings, crowns, bridges, and implants.',
    steps: [
      'Diagnosis (X-ray, clinical exam)',
      'Removal of decay or damaged tissue',
      'Selection of material (composite, ceramic, metal)',
      'Placement & shaping',
      'Bite check & final adjustment',
    ],
  },
  {
    num: '04',
    title: 'Pediatric Dentistry',
    subtitle: 'Child-Friendly, Preventive, Educational',
    image: imgPediatric,
    tagline:
      'Dental care tailored specifically for children from infancy through adolescence. Focuses on prevention, education, and early intervention.',
    steps: [
      'First visit & child-friendly introduction',
      'Clinical exam + X-rays (age-appropriate)',
      'Cleaning & fluoride treatment',
      'Cavity detection & sealants if needed',
      'Parent guidance on diet & brushing habits',
    ],
  },
];

const N = SERVICES.length;

// ── Scroll zone logic ─────────────────────────────────────────────────────
// The pinned section scrolls N * 100vh total. Divided into N equal bands:
//   index 0 → progress [0,   1/N)
//   index 1 → progress [1/N, 2/N)
//   index 2 → progress [2/N, 3/N)
//   index 3 → progress [3/N, 1.0]  ← clamped
// Math.floor gives equal bands with correct up/down symmetry.
function progressToIndex(progress: number): number {
  return Math.min(N - 1, Math.floor(progress * N));
}

export default function Services() {
  const [active, setActive] = useState(0);

  const panelRef      = useRef<HTMLDivElement>(null);
  const activeRef     = useRef(0);        // mirrors `active` — readable in callbacks
  const stRef         = useRef<ScrollTrigger | null>(null);
  const inSection     = useRef(false);    // true while panel is pinned
  const locked        = useRef(false);    // true while animating to targetBand
  const targetBand    = useRef(-1);       // band we are currently scrolling toward
  const lastWheelTime = useRef(0);        // timestamp of last downward wheel event

  // ── PIN + SINGLE onUpdate ────────────────────────────────────────────────
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: panel,
        start: 'top top',
        // N bands × 100vh each. The first band is "free" (panel enters viewport),
        // so we scroll (N-1) extra bands to cover all N services.
        end: `+=${N * 100}vh`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onToggle: (self) => {
          inSection.current = self.isActive;
          // Leaving section upward — ensure state resets cleanly
          if (!self.isActive && self.progress === 0) {
            activeRef.current = 0;
            setActive(0);
          }
        },
        onUpdate: (self) => {
          const idx = progressToIndex(self.progress);
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
          // Progress-based unlock: hold the lock exactly as long as the animation
          // takes to reach the target band — no arbitrary timer.
          if (locked.current && activeRef.current === targetBand.current) {
            locked.current = false;
          }
        },
      });

      stRef.current = st;
    });

    return () => {
      ctx.revert();
      stRef.current = null;
    };
  }, []);

  // ── Downward wheel: exactly ONE GESTURE = ONE STEP ──────────────────────
  //
  // Two-layer protection — neither alone is sufficient:
  //
  //   Layer 1 — gesture gap (150 ms silence = new gesture):
  //     Groups all events from one trackpad swipe into a single unit.
  //     No matter how large deltaY gets mid-swipe, only the FIRST event fires
  //     a step. All subsequent events within 150 ms are absorbed silently.
  //
  //   Layer 2 — progress-based lock:
  //     `locked` stays true until onUpdate confirms scroll reached targetBand.
  //     Even if 150 ms passes mid-animation (e.g. slow Lenis easing), a new
  //     "gesture" is blocked until we've actually arrived.
  //
  //   Capture phase + stopImmediatePropagation: our handler fires before Lenis
  //   so Lenis never accumulates competing wheel velocity for intercepted events.
  //
  //   Upward scroll: we return without stopImmediatePropagation → Lenis handles
  //   it freely → onUpdate reverses state naturally. ✓
  useEffect(() => {
    const GESTURE_GAP_MS = 150;

    const onWheel = (e: WheelEvent) => {
      if (!inSection.current) return;   // outside section — pass to Lenis
      if (e.deltaY < 8) return;         // upward / negligible — let Lenis handle

      const next = activeRef.current + 1;
      if (next >= N) return;            // at last service — let user scroll out

      // Own this event — Lenis must not see or process its raw delta
      e.stopImmediatePropagation();
      e.preventDefault();

      // Layer 1: gap check — is this the first event of a new gesture?
      const now = Date.now();
      const isNewGesture = now - lastWheelTime.current > GESTURE_GAP_MS;
      lastWheelTime.current = now;

      // Layer 2: lock check — is the previous animation still reaching target?
      if (locked.current) return;     // absorb — animation in progress

      // Same continuous gesture, already handled on its first event
      if (!isNewGesture) return;

      // New gesture AND unlocked → advance exactly one step
      locked.current     = true;
      targetBand.current = next;

      const st = stRef.current;
      if (!st) return;

      const targetScrollTop = st.start + ((next + 0.5) / N) * (st.end - st.start);

      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(targetScrollTop, {
          duration: 0.75,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
      } else {
        window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', onWheel, { capture: true });
  }, []);
  // ── Click handler — scroll to the target band via Lenis ─────────────────
  // Target: middle of the band → (i + 0.5) / N along the scroll range.
  // This guarantees the onUpdate will land cleanly on index i.
  const handleClick = (i: number) => {
    if (i === activeRef.current) return;

    const st = stRef.current;
    if (!st) return;

    const totalScroll = st.end - st.start;
    const targetProgress = (i + 0.5) / N;           // mid-point of band i
    const targetScrollTop = st.start + targetProgress * totalScroll;

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(targetScrollTop, { duration: 0.9, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
    } else {
      window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="svcpin" id="services" ref={panelRef} aria-label="Our Services">

      {/* ── Section Header ──────────────────────────────── */}
      <div className="container" style={{ textAlign: 'center', paddingTop: '100px', flexShrink: 0, paddingBottom: '20px' }}>
        <span className="section-label">Our Services</span>
        <div className="divider" style={{ margin: '0 auto 16px' }} />
        <h2 className="section-title">
          Complete care for every smile.
        </h2>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          From a simple polish to full smile restoration — we do it all under one roof.
        </p>
      </div>

      {/* ── Three columns ────────────────────────────────── */}
      <div className="svcpin__body container">

        {/* LEFT — title list */}
        <div className="svcpin__list" role="list">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className={[
                'svcpin__row',
                i === active ? 'svcpin__row--active' : '',
                i < active   ? 'svcpin__row--done'   : '',
              ].join(' ')}
              role="button"
              tabIndex={0}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => handleClick(i)}
              onKeyDown={(e) => e.key === 'Enter' && handleClick(i)}
            >
              <div className="svcpin__row-inner">
                <h3 className="svcpin__row-title">{s.title}</h3>
                <span className="svcpin__row-num">{s.num}</span>
              </div>
              <p className="svcpin__row-subtitle">{s.subtitle}</p>
              <div className="svcpin__row-divider" />
            </div>
          ))}
        </div>

        {/* CENTER — overlapping images (CSS opacity crossfade) */}
        <div className="svcpin__img-wrap">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className={`svcpin__img-box ${i === active ? 'svcpin__img-box--in' : 'svcpin__img-box--out'}`}
            >
              <img src={s.image} alt={s.title} className="svcpin__img" />
            </div>
          ))}
        </div>

        {/* RIGHT — overlapping info panels (CSS opacity crossfade) */}
        <div className="svcpin__info-wrap">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className={`svcpin__info ${i === active ? 'svcpin__info--in' : 'svcpin__info--out'}`}
              aria-hidden={i !== active}
            >
              <p className="svcpin__tagline">{s.tagline}</p>
              <ul className="svcpin__steps">
                {s.steps.map((step, j) => (
                  <li key={j} className="svcpin__step">
                    <span className="svcpin__step-num">{String(j + 1).padStart(2, '0')}</span>
                    {step}
                  </li>
                ))}
              </ul>

              <div className="svcpin__card-footer">
                <div className="svcpin__specialists">
                  <div className="svcpin__avatars">
                    {SPECIALISTS.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Dental specialist ${idx + 1}`}
                        className="svcpin__avatar"
                      />
                    ))}
                  </div>
                  <span className="svcpin__specialists-label">Our Dental Specialists</span>
                </div>

                <Link to="/services" className="svcpin__cta" aria-label="Read more about this service">
                  <span className="svcpin__cta-text">Read More</span>
                  <div className="svcpin__cta-icon-wrapper" aria-hidden="true">
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
          ))}
        </div>

      </div>

      {/* ── Footer: dot indicators ────────────────────────── */}
      <div className="svcpin__footer container">
        <div className="svcpin__dots" role="tablist" aria-label="Service indicator">
          {SERVICES.map((s, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to ${s.title}`}
              className={[
                'svcpin__dot',
                i === active ? 'svcpin__dot--active' : '',
                i < active   ? 'svcpin__dot--done'   : '',
              ].join(' ')}
              onClick={() => handleClick(i)}
            />
          ))}
        </div>
        <span className="svcpin__scroll-hint" aria-hidden="true">
          {active + 1} / {N}
        </span>
      </div>

    </div>
  );
}
