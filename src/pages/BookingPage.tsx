import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Pencil,
  MapPin,
  Clock,
  Phone,
  Check,
} from 'lucide-react';
import './BookingPage.css';

// ─── Clinic hours (0=Sun … 6=Sat) ────────────────────────────────────────────
const CLINIC_HOURS: Record<number, { open: number; close: number }> = {
  1: { open: 9,  close: 18.5 }, // Mon
  2: { open: 9,  close: 18.5 }, // Tue
  3: { open: 9,  close: 18.5 }, // Wed
  4: { open: 9,  close: 18 },   // Thu
  5: { open: 9,  close: 18.5 }, // Fri
  6: { open: 9,  close: 15 },   // Sat
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

function generateSlots(dayOfWeek: number): string[] {
  const h = CLINIC_HOURS[dayOfWeek];
  if (!h) return [];
  const slots: string[] = [];
  let current = h.open * 60;
  const end = h.close * 60;
  while (current <= end - 30) {
    const hr = Math.floor(current / 60);
    const mn = current % 60;
    slots.push(`${String(hr).padStart(2, '0')}:${String(mn).padStart(2, '0')}`);
    current += 30;
  }
  return slots;
}

const isPast = (d: Date): boolean => {
  const t = new Date(); t.setHours(0, 0, 0, 0); return d < t;
};

const fmtDate = (d: Date | null): string =>
  d ? d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : '';

// ─── Services list ────────────────────────────────────────────────────────────
const SERVICES = [
  { id: 'general',        name: 'General Dentistry',       tag: 'Comprehensive Care', icon: '🦷' },
  { id: 'orthodontics',   name: 'Orthodontics',            tag: 'Braces & Aligners',  icon: '😁' },
  { id: 'invisalign',     name: 'Invisalign',              tag: 'Clear Aligners',     icon: '✨' },
  { id: 'whitening',      name: 'Teeth Whitening',         tag: 'Brightening',        icon: '💎' },
  { id: 'implant',        name: 'Dental Implants',         tag: 'Restoration',        icon: '🔩' },
  { id: 'crown',          name: 'Dental Crowns',           tag: 'Restoration',        icon: '👑' },
  { id: 'veneer',         name: 'Dental Veneers',          tag: 'Cosmetic',           icon: '🌟' },
  { id: 'cosmetic',       name: 'Cosmetic Dentistry',      tag: 'Aesthetics',         icon: '🎨' },
  { id: 'pediatric',      name: 'Paediatric Dentistry',    tag: 'Children',           icon: '🧒' },
  { id: 'endodontics',    name: 'Endodontics',             tag: 'Root Canal',         icon: '💉' },
  { id: 'lingual',        name: 'Lingual Orthodontics',    tag: 'Hidden Braces',      icon: '🫦' },
  { id: 'mouthguard',     name: 'Mouthguards',             tag: 'Protection',         icon: '🛡️' },
  { id: 'preventive',     name: 'Preventive Orthodontics', tag: 'Children',           icon: '🌱' },
];

// ─── Mini Calendar ────────────────────────────────────────────────────────────
interface MiniCalendarProps {
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
}

function MiniCalendar({ selectedDate, onSelect }: MiniCalendarProps) {
  const today = new Date();
  const [vy, setVy] = useState(today.getFullYear());
  const [vm, setVm] = useState(today.getMonth());

  const firstDay    = new Date(vy, vm, 1).getDay();
  const daysInMonth = new Date(vy, vm + 1, 0).getDate();

  const prev = () => { if (vm === 0) { setVm(11); setVy(y => y - 1); } else setVm(m => m - 1); };
  const next = () => { if (vm === 11) { setVm(0); setVy(y => y + 1); } else setVm(m => m + 1); };

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      {/* Month nav */}
      <div className="bk-cal__nav">
        <button className="bk-cal__nav-btn" onClick={prev} aria-label="Previous month">
          <ChevronLeft size={16} />
        </button>
        <span className="bk-cal__month">{MONTH_NAMES[vm]} {vy}</span>
        <button className="bk-cal__nav-btn" onClick={next} aria-label="Next month">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="bk-cal__day-headers">
        {DAY_NAMES.map(d => (
          <div key={d} className="bk-cal__day-name">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="bk-cal__grid">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} className="bk-cal__empty" />;
          const date  = new Date(vy, vm, day);
          const dow   = date.getDay();
          const off   = isPast(date) || !CLINIC_HOURS[dow];
          const sel   =
            selectedDate &&
            selectedDate.getDate()     === day &&
            selectedDate.getMonth()    === vm  &&
            selectedDate.getFullYear() === vy;
          const now =
            today.getDate()     === day &&
            today.getMonth()    === vm  &&
            today.getFullYear() === vy;

          return (
            <button
              key={day}
              disabled={off}
              onClick={() => onSelect(new Date(vy, vm, day))}
              className={[
                'bk-cal__day',
                off   ? 'bk-cal__day--disabled'  : '',
                sel   ? 'bk-cal__day--selected'  : '',
                now && !sel ? 'bk-cal__day--today' : '',
              ].join(' ')}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bk-cal__legend">
        <span className="bk-cal__legend-item">
          <span className="bk-cal__legend-dot bk-cal__legend-dot--today" />
          Today
        </span>
        <span className="bk-cal__legend-item">
          <span className="bk-cal__legend-dot bk-cal__legend-dot--closed" />
          Closed / past
        </span>
      </div>
    </div>
  );
}

// ─── Main Booking Page ────────────────────────────────────────────────────────
type Step = 'service' | 'date' | 'time' | 'form';

export default function BookingPage() {
  const [step,            setStep]          = useState<Step>('service');
  const [selectedService, setSelectedSvc]   = useState<string | null>(null);
  const [selectedDate,    setSelectedDate]  = useState<Date | null>(null);
  const [selectedTime,    setSelectedTime]  = useState<string | null>(null);
  const [confirmed,       setConfirmed]     = useState(false);
  const [submitting,      setSubmitting]    = useState(false);
  const [submitError,     setSubmitError]   = useState<string | null>(null);

  // ── Edit earlier step ──────────────────────────────────────────────────────
  const editStep = (s: Step) => {
    if (s === 'service') { setSelectedSvc(null); setSelectedDate(null); setSelectedTime(null); setStep('service'); }
    if (s === 'date')    { setSelectedDate(null); setSelectedTime(null); setStep('date'); }
    if (s === 'time')    { setSelectedTime(null); setStep('time'); }
  };

  const handleServiceSelect = (id: string) => {
    setSelectedSvc(id);
    setTimeout(() => setStep('date'), 120);
  };

  const handleDateSelect = (d: Date) => {
    setSelectedDate(d);
    setSelectedTime(null);
    setTimeout(() => setStep('time'), 320);
  };

  const handleTimeSelect = (t: string) => {
    setSelectedTime(t);
    setTimeout(() => setStep('form'), 320);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    // ── In local dev the Vercel API route doesn't run, so we skip the fetch
    //    and simulate a successful booking instead.
    const isDev = import.meta.env.DEV;
    if (isDev) {
      await new Promise(r => setTimeout(r, 600)); // simulate network delay
      setConfirmed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSubmitting(false);
      return;
    }

    const fd = new FormData(e.currentTarget);
    const body = {
      firstName:   fd.get('firstName'),
      lastName:    fd.get('lastName'),
      email:       fd.get('email'),
      phone:       fd.get('phone'),
      dob:         fd.get('dob'),
      patientType: fd.get('patientType'),
      insurance:   fd.get('insurance'),
      notes:       fd.get('notes'),
      service:     selectedSvcObj?.name ?? selectedService,
      date:        fmtDate(selectedDate),
      time:        selectedTime,
    };

    try {
      const res = await fetch('/api/booking', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });

      if (!res.ok) {
        // Safely try to parse JSON — the response may be an HTML error page
        let errorMessage = `Server error (${res.status}). Please call us directly.`;
        try {
          const data = await res.json();
          if (data?.error) errorMessage = data.error;
        } catch {
          // body wasn't JSON — keep the fallback message above
        }
        throw new Error(errorMessage);
      }

      setConfirmed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSvcObj = SERVICES.find(s => s.id === selectedService);
  const timeSlots      = selectedDate ? generateSlots(selectedDate.getDay()) : [];

  // ─── Confirmed ─────────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="bk-page">
        <Helmet>
          <title>Booking Confirmed | Dental of Valor</title>
        </Helmet>
        <div className="bk-confirmed step-enter">
          <div className="bk-confirmed__icon">
            <CheckCircle size={44} />
          </div>
          <h1 className="bk-confirmed__title">Appointment confirmed!</h1>
          <p className="bk-confirmed__sub">
            We'll send a reminder 24 hours before your visit.
          </p>

          <div className="bk-confirmed__card">
            {selectedSvcObj && (
              <div className="bk-confirmed__row">
                <span>{selectedSvcObj.icon}</span>
                {selectedSvcObj.name}
              </div>
            )}
            <div className="bk-confirmed__row">
              <MapPin size={16} />
              Rue de Formanoir 9, 1070 Anderlecht
            </div>
            <div className="bk-confirmed__row">
              <span>📅</span>
              {fmtDate(selectedDate)}
            </div>
            <div className="bk-confirmed__row">
              <Clock size={16} />
              {selectedTime}
            </div>
          </div>

          <p className="bk-confirmed__note">
            If you need to reschedule, please call us at least 24 hours before your
            appointment at <strong>+32 2 520 52 32</strong>.
          </p>

          <button
            className="bk-continue"
            onClick={() => {
              setConfirmed(false);
              setStep('service');
              setSelectedSvc(null);
              setSelectedDate(null);
              setSelectedTime(null);
            }}
          >
            Book another appointment →
          </button>
        </div>
      </div>
    );
  }

  // ─── Main flow ─────────────────────────────────────────────────────────────
  return (
    <div className="bk-page">
      <Helmet>
        <title>Book an Appointment | Dental of Valor</title>
        <meta name="description" content="Book your dental appointment online — choose your service, date and time in just a few steps." />
      </Helmet>

      {/* ── Hero header ── */}
      <div className="bk-page__hero">
        <div className="container">
          <span className="bk-label">Schedule a Visit</span>
          <h1 className="bk-title">
            Book your<br />appointment.
          </h1>
          <p className="bk-subtitle">
            A few steps and you're set — we'll take care of the rest.
          </p>
        </div>
      </div>

      {/* ── Content column ── */}
      <div className="bk-col">

        {/* ── Summary pills ── */}
        <AnimatePresence>
          {(selectedService || selectedDate || selectedTime) && (
            <motion.div
              className="bk-pills"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {selectedSvcObj && (
                <button className="bk-pill" onClick={() => editStep('service')}>
                  {selectedSvcObj.icon} {selectedSvcObj.name}
                  <Pencil size={11} className="bk-pill__edit" />
                </button>
              )}
              {selectedDate && (
                <button className="bk-pill" onClick={() => editStep('date')}>
                  📅 {fmtDate(selectedDate)}
                  <Pencil size={11} className="bk-pill__edit" />
                </button>
              )}
              {selectedTime && (
                <button className="bk-pill" onClick={() => editStep('time')}>
                  🕐 {selectedTime}
                  <Pencil size={11} className="bk-pill__edit" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Animated step wrapper ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">

            {/* ══ STEP 1 — Service ══════════════════════════════════════════════ */}
            {step === 'service' && (
              <motion.div
                key="service"
                className="bk-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.25, 0, 0.15, 1] }}
              >
                <span className="bk-card__step-label">1 — What brings you in?</span>
                <div className="bk-services">
                  {SERVICES.map(svc => (
                    <button
                      key={svc.id}
                      className={`bk-svc-btn ${selectedService === svc.id ? 'bk-svc-btn--active' : ''}`}
                      onClick={() => handleServiceSelect(svc.id)}
                    >
                      <span className="bk-svc-btn__icon">{svc.icon}</span>
                      <span>
                        <span className="bk-svc-btn__name">{svc.name}</span>
                        <span className="bk-svc-btn__tag">{svc.tag}</span>
                      </span>
                      <Check size={15} className="bk-svc-btn__check" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ STEP 2 — Date ═════════════════════════════════════════════════ */}
            {step === 'date' && (
              <motion.div
                key="date"
                className="bk-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.25, 0, 0.15, 1] }}
              >
                <span className="bk-card__step-label">2 — Pick a date</span>
                <MiniCalendar selectedDate={selectedDate} onSelect={handleDateSelect} />
              </motion.div>
            )}

            {/* ══ STEP 3 — Time ═════════════════════════════════════════════════ */}
            {step === 'time' && (
              <motion.div
                key="time"
                className="bk-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.25, 0, 0.15, 1] }}
              >
                <span className="bk-card__step-label">3 — Choose a time</span>
                {timeSlots.length === 0 ? (
                  <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-muted)' }}>
                    We're closed on this day — tap the date pill above to change it.
                  </p>
                ) : (
                  <div className="bk-times">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        className={`bk-time-btn ${selectedTime === slot ? 'bk-time-btn--active' : ''}`}
                        onClick={() => handleTimeSelect(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

        {/* ══ STEP 4 — Patient details form ════════════════════════════════ */}
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.25, 0, 0.15, 1] }}
              >
                <form className="bk-form" onSubmit={handleSubmit}>
                  <h2 className="bk-form__heading">Your details</h2>

                  {/* Name */}
                  <div className="bk-form__row">
                    <div className="bk-field">
                      <label htmlFor="bk-first">First name *</label>
                      <input id="bk-first" name="firstName" type="text" placeholder="Sophie" required />
                    </div>
                    <div className="bk-field">
                      <label htmlFor="bk-last">Last name *</label>
                      <input id="bk-last" name="lastName" type="text" placeholder="Dupont" required />
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bk-field">
                    <label htmlFor="bk-email">Email address *</label>
                    <input id="bk-email" name="email" type="email" placeholder="sophie@example.com" required />
                  </div>

                  <div className="bk-field">
                    <label htmlFor="bk-phone">Phone number *</label>
                    <input id="bk-phone" name="phone" type="tel" placeholder="+32 …" required />
                  </div>

                  {/* Date of birth */}
                  <div className="bk-field">
                    <label htmlFor="bk-dob">Date of birth</label>
                    <input id="bk-dob" name="dob" type="date" />
                  </div>

                  {/* New / returning patient */}
                  <div className="bk-field">
                    <label htmlFor="bk-patient-type">Patient type</label>
                    <select id="bk-patient-type" name="patientType">
                      <option value="">Select…</option>
                      <option value="new">New patient</option>
                      <option value="returning">Returning patient</option>
                    </select>
                  </div>

                  {/* Mutualiteit / insurance */}
                  <div className="bk-field">
                    <label htmlFor="bk-insurance">Mutualiteit / Insurance (optional)</label>
                    <select id="bk-insurance" name="insurance">
                      <option value="">Select your mutual fund…</option>
                      <option>CM – Christelijke Mutualiteit</option>
                      <option>Solidaris – Socialistische Mutualiteit</option>
                      <option>Helan – Onafhankelijk Ziekenfonds</option>
                      <option>MLOZ – Alliance Nationale</option>
                      <option>Neutrale Ziekenfonds</option>
                      <option>Other / Private insurance</option>
                      <option>None</option>
                    </select>
                  </div>

                  {/* Notes / reason */}
                  <div className="bk-field">
                    <label htmlFor="bk-notes">Additional notes (symptoms, concerns, allergies…)</label>
                    <textarea
                      id="bk-notes"
                      name="notes"
                      rows={3}
                      placeholder="Tell us anything that would help us prepare for your visit…"
                    />
                  </div>

                  {/* Consent */}
                  <label className="bk-checkbox-row">
                    <input type="checkbox" required />
                    I agree to the clinic's privacy policy and consent to my information being used to manage my appointment.
                  </label>

                  {/* API error message */}
                  {submitError && (
                    <p style={{ color: '#c0392b', fontSize: '0.9rem', margin: '0 0 8px' }}>
                      ⚠️ {submitError}
                    </p>
                  )}

                  <button type="submit" className="bk-submit" disabled={submitting}>
                    <CheckCircle size={17} />
                    {submitting ? 'Sending…' : 'Confirm Appointment'}
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>{/* end animated step wrapper */}

        {/* ── Clinic info strip (hidden on form step) ── */}
        {step !== 'form' && (
          <div className="bk-info-strip">
            <div className="bk-info-item">
              <MapPin size={15} />
              <span>Rue de Formanoir 9, 1070 Anderlecht, Belgium</span>
            </div>
            <div className="bk-info-item">
              <Clock size={15} />
              <span>Mon-Wed &amp; Fri 09:00 – 18:30 · Thu 09:00 – 18:00 · Sat 09:00 – 15:00</span>
            </div>
            <div className="bk-info-item">
              <Phone size={15} />
              <Link to="tel:+3225205232" style={{ color: 'var(--clr-primary-light)', fontWeight: 600 }}>
                +32 2 520 52 32
              </Link>
            </div>
          </div>
        )}

      </div>{/* end bk-col */}
    </div>
  );
}
