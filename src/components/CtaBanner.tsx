import './CtaBanner.css';
import { Link } from 'react-router-dom';

export default function CtaBanner() {
  return (
    <section className="cta-banner section" id="contact" aria-labelledby="cta-heading">
      {/* Background deco */}
      <div className="cta-banner__bg" aria-hidden="true">
        <div className="cta-banner__bg-circle-1" />
        <div className="cta-banner__bg-circle-2" />
        <div className="cta-banner__bg-dots" />
      </div>

      <div className="container">
        <div className="cta-banner__inner">
          <div className="cta-banner__content" data-reveal>
            <div className="cta-banner__badge">
              <span className="cta-banner__badge-dot" />
              Now accepting new patients.
            </div>
            <h2 className="cta-banner__title" id="cta-heading">
              Book Your First Visit
            </h2>
          </div>

          <div className="cta-banner__actions" data-reveal data-reveal-delay="0.15">
            <div className="cta-banner__action-buttons">
              <Link to="/booking" className="btn btn--white btn--lg" id="cta-call-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
