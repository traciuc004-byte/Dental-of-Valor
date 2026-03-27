import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './About.css';

import aboutDoctor  from '../assets/about_doctor.png';
import aboutPatient from '../assets/about_patient.png';
import smileSophie  from '../assets/smile_sophie.png';
import smileMarc    from '../assets/smile_marc.png';
import smileJulie   from '../assets/smile_julie.png';
import teamImg      from '../assets/team.png';

// ── Data ────────────────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  { value: '2,000+', label: 'Patients treated' },
  { value: 'RIZIV / INAMI', label: 'Accredited' },
  { value: '6', label: 'Specialist services' },
  { value: 'Since 2012', label: 'Serving Anderlecht' },
];

const WHY_US = [
  {
    title: 'A "Masterclass" in Care.',
    body: 'From the friendly welcome to our precise anesthesia techniques, we prioritize a painless and professional experience.',
  },
  {
    title: 'Everything in one place.',
    body: 'All specialists, all treatments, one address. No referrals, no extra trips, no fragmented care.',
  },
  {
    title: 'Meticulous and Patient.',
    body: 'We never rush. We wait until anesthesia is perfect and take the time to ensure every prosthesis fits flawlessly.',
  },
  {
    title: 'For the whole family.',
    body: 'From child dental care to advanced prostheses for seniors — one clinic for every stage of life.',
  },
  {
    title: 'Clear communication.',
    body: 'Dutch, French, English. You are always understood, never rushed, and always treated with kindness.',
  },
];

const SERVICES_QUICK = [
  { icon: '🦷', name: 'General Dentistry', desc: 'Check-ups, fillings, hygiene.' },
  { icon: '✨', name: 'Whitening', desc: 'In-chair and take-home options.' },
  { icon: '🔩', name: 'Implants', desc: 'Natural-looking, permanent solution.' },
  { icon: '📐', name: 'Orthodontics', desc: 'Braces and clear aligners.' },
];

const TESTIMONIALS = [
  {
    name: 'jean volon',
    location: 'Anderlecht',
    img: smileSophie,
    rating: 5,
    text: 'Thank you to Dr. Kim for his kindness and meticulous, highly professional care, which ensured the perfect success of my dental prostheses.',
  },
  {
    name: 'TRunKZ Ds',
    location: 'Anderlecht',
    img: smileMarc,
    rating: 5,
    text: 'A master in his field, with reassuring patience and calm for stressed individuals, I highly recommend this dentist.',
  },
  {
    name: 'Imad Ghali',
    location: 'Anderlecht',
    img: smileJulie,
    rating: 5,
    text: 'The welcome was fantastic, the dentist very friendly, and he preferred to wait to ensure the anesthesia was perfect... Masterclass!!',
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="abt-stars" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Dental of Valor</title>
        <meta
          name="description"
          content="Modern dental care in Anderlecht — professional expertise, transparent pricing, and RIZIV/INAMI accredited. Book your visit today."
        />
      </Helmet>

      <div className="about-page">

        {/* ══ 1. HERO ════════════════════════════════════════════════════ */}
        <section className="abt-hero">
          <div className="container abt-hero__inner">
            <div className="abt-hero__text" data-reveal>
              <span className="section-label">About Us</span>
              <div className="divider" />
              <h1 className="abt-hero__title">
                Expert dental care<br />you can trust.
              </h1>
              <p className="abt-hero__sub">
                Professional treatments, transparent pricing, and a dedicated team focused on your comfort.
              </p>
              <Link to="/booking" className="btn-shiny-wrap" id="about-hero-cta">
                <span className="btn--shiny">Book Appointment</span>
              </Link>
            </div>
            <div className="abt-hero__image" data-reveal data-reveal-dir="right">
              <div className="abt-hero__img-card">
                <img src={teamImg} alt="Our dental team" />
              </div>
            </div>
          </div>
        </section>

        {/* ══ 2. TRUST STRIP ════════════════════════════════════════════ */}
        <section className="abt-trust">
          <div className="container">
            <div className="abt-trust__grid" data-reveal-group>
              {TRUST_ITEMS.map((t, i) => (
                <div key={i} className="abt-trust__item" data-reveal-item>
                  <span className="abt-trust__value">{t.value}</span>
                  <span className="abt-trust__label">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 3. WHY US — statement-driven, not icons ═══════════════════ */}
        <section className="abt-why section">
          <div className="container">
            <div className="abt-why__header" data-reveal>
              <span className="section-label">Our Approach</span>
              <div className="divider" style={{ margin: '0 auto 16px' }} />
              <h2 className="section-title">Why patients choose us.</h2>
              <p className="section-subtitle">
                This is where people decide if you're different. We think you'll see it too.
              </p>
            </div>

            <div className="abt-why__list" data-reveal-group>
              {WHY_US.map((item, i) => (
                <div key={i} className="abt-why__item" data-reveal-item>
                  <span className="abt-why__num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="abt-why__content">
                    <h3 className="abt-why__title">{item.title}</h3>
                    <p className="abt-why__body">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 4. HUMAN SECTION — trust builder ═════════════════════════ */}
        <section className="abt-human section">
          <div className="container abt-human__grid">
            <div className="abt-human__image" data-reveal data-reveal-dir="left">
              <img src={aboutDoctor} alt="Dr. Kim, lead dentist" className="abt-human__photo" />
              <div className="abt-human__quote-card">
                <p>"We take the time to ensure every smile is perfect and every patient feels safe."</p>
                <span>— Dr. Kim, Lead Dentist</span>
              </div>
            </div>
            <div className="abt-human__text" data-reveal>
              <span className="section-label">The People Behind The Care</span>
              <div className="divider" />
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                Behind every treatment<br />is a real person.
              </h2>
              <p className="abt-human__body">
                We know most people don't enjoy going to the dentist. Fear, uncertainty, or a bad
                experience in the past can make it feel impossible.
              </p>
              <p className="abt-human__body">
                That's why our team is trained not just in dentistry, but in making you feel safe.
                No rushed appointments. No clinical coldness. Just clear, honest, human care.
              </p>
            </div>
          </div>
        </section>

        {/* ══ 5. EXPERIENCE — reduce anxiety ════════════════════════════ */}
        <section className="abt-experience section">
          <div className="container abt-experience__inner">
            <div className="abt-experience__text" data-reveal>
              <span className="section-label">Your Visit</span>
              <div className="divider" />
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                From the moment<br />you walk in.
              </h2>
              <p className="section-subtitle" style={{ textAlign: 'left', margin: '0 0 40px' }}>
                Everything is designed to be simple, clear, and comfortable.
              </p>
              <ul className="abt-experience__list">
                {[
                  'Clear explanations before any treatment begins',
                  'No rushed appointments — we take the time you need',
                  'Transparent pricing, checked with your mutualiteit',
                  'Comfortable, modern digital equipment',
                  'A team available in Dutch, French, and English',
                ].map((item, i) => (
                  <li key={i} className="abt-experience__point">
                    <span className="abt-experience__check" aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="abt-experience__image" data-reveal data-reveal-dir="right">
              <img src={aboutPatient} alt="Patient at our clinic, relaxed and comfortable" />
            </div>
          </div>
        </section>

        {/* ══ 6. SERVICES — quick overview ══════════════════════════════ */}
        <section className="abt-services section">
          <div className="container">
            <div className="abt-services__header" data-reveal>
              <span className="section-label">Services</span>
              <div className="divider" style={{ margin: '0 auto 16px' }} />
              <h2 className="section-title">Everything you need, here.</h2>
            </div>
            <div className="abt-services__grid" data-reveal-group>
              {SERVICES_QUICK.map((s, i) => (
                <Link key={i} to="/services" className="abt-services__card" data-reveal-item>
                  <span className="abt-services__icon">{s.icon}</span>
                  <h3 className="abt-services__name">{s.name}</h3>
                  <p className="abt-services__desc">{s.desc}</p>
                  <span className="abt-services__arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 7. SOCIAL PROOF — testimonials ════════════════════════════ */}
        <section className="abt-reviews section">
          <div className="container">
            <div className="abt-reviews__header" data-reveal>
              <span className="section-label">Patient Stories</span>
              <div className="divider" style={{ margin: '0 auto 16px' }} />
              <h2 className="section-title">Real patients. Real words.</h2>
            </div>
            <div className="abt-reviews__grid" data-reveal-group>
              {TESTIMONIALS.map((r, i) => (
                <article key={i} className="abt-review-card" data-reveal-item>
                  <Stars n={r.rating} />
                  <p className="abt-review-card__text">"{r.text}"</p>
                  <footer className="abt-review-card__author">
                    <img src={r.img} alt={`${r.name}'s smile`} className="abt-review-card__smile" />
                    <div>
                      <strong>{r.name}</strong>
                      <span>{r.location}</span>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
            <div className="abt-reviews__rating" data-reveal>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span><strong>4.8</strong> · 40+ reviews on Google</span>
            </div>
          </div>
        </section>

        {/* ══ 8. FINAL CTA ══════════════════════════════════════════════ */}
        <section className="abt-cta section">
          <div className="container">
            <div className="abt-cta__inner" data-reveal>
              <span className="abt-cta__eyebrow">Ready when you are</span>
              <h2 className="abt-cta__title">
                Feel confident about your<br />smile again.
              </h2>
              <Link to="/booking" className="btn-shiny-wrap" id="about-final-cta">
                <span className="btn--shiny">Book your visit today</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
