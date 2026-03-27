import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// ── Rate limiting (simple in-memory, resets per cold-start) ──────────────────
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS = 5;              // max 5 bookings per minute per IP
const ipMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count++;
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── Only accept POST ───────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Rate-limit by IP ───────────────────────────────────────────────────────
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // ── Parse & validate body ──────────────────────────────────────────────────
  const { firstName, lastName, email, phone, dob, patientType, insurance, notes, service, date, time } = req.body ?? {};

  if (!firstName || !lastName || !email || !phone || !service || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Basic email format check (server-side)
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // ── Send email via Resend ──────────────────────────────────────────────────
  const resend = new Resend(process.env.RESEND_API_KEY);
  const clinicEmail = process.env.CLINIC_EMAIL ?? 'hello@yourdentalclinic.be';

  try {
    // 1️⃣ Notify the clinic
    await resend.emails.send({
      from: 'Booking System <noreply@yourdentalclinic.be>',
      to:   clinicEmail,
      subject: `New Appointment: ${firstName} ${lastName} — ${service}`,
      html: `
        <h2>New Booking Request</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:540px">
          <tr><td><b>Patient</b></td><td>${firstName} ${lastName}</td></tr>
          <tr><td><b>Email</b></td><td>${email}</td></tr>
          <tr><td><b>Phone</b></td><td>${phone}</td></tr>
          <tr><td><b>Date of Birth</b></td><td>${dob ?? '—'}</td></tr>
          <tr><td><b>Patient Type</b></td><td>${patientType ?? '—'}</td></tr>
          <tr><td><b>Insurance</b></td><td>${insurance ?? '—'}</td></tr>
          <tr><td><b>Service</b></td><td>${service}</td></tr>
          <tr><td><b>Date</b></td><td>${date}</td></tr>
          <tr><td><b>Time</b></td><td>${time}</td></tr>
          <tr><td><b>Notes</b></td><td>${notes ?? '—'}</td></tr>
        </table>
      `,
    });

    // 2️⃣ Send a confirmation to the patient
    await resend.emails.send({
      from: `Your Dental Clinic <noreply@yourdentalclinic.be>`,
      to:   email,
      subject: 'Your appointment is confirmed ✓',
      html: `
        <h2>Appointment Confirmed</h2>
        <p>Hi ${firstName},</p>
        <p>We have received your booking request. Here's a summary:</p>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:540px">
          <tr><td><b>Service</b></td><td>${service}</td></tr>
          <tr><td><b>Date</b></td><td>${date}</td></tr>
          <tr><td><b>Time</b></td><td>${time}</td></tr>
          <tr><td><b>Address</b></td><td>Rue de la Clinique 1, 1000 Brussels</td></tr>
        </table>
        <p>If you need to reschedule, please call us at <b>+32 (0) 000 00 00</b> at least 24 hours before your appointment.</p>
        <p>See you soon!</p>
        <p><em>Your Dental Clinic Team</em></p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    // Do NOT log patient details — only log the error structure
    console.error('[booking] Resend error:', (err as Error).message);
    return res.status(500).json({ error: 'Could not send confirmation. Please call us directly.' });
  }
}
