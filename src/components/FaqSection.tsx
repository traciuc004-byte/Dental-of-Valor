import { useState } from 'react';
import './FaqSection.css';

const FAQ_DATA = [
  {
    q: 'I am very nervous about dental pain. How do you handle anesthesia?',
    a: 'We prioritize your comfort above all else. Our approach is what patients call a "Masterclass" in pain management. We use high-quality anesthesia and, most importantly, we prefer to wait as long as needed to ensure it is 100% effective before starting any procedure. We never rush to the next patient if you are not completely comfortable.',
  },
  {
    q: 'How transparent is your pricing?',
    a: 'We believe quality dental care should be accessible. Our prices are very reasonable and we provide clear, upfront estimates before any treatment begins. There are no hidden fees, and we work with most Belgian mutualities to ensure you get the maximum reimbursement possible.',
  },
  {
    q: 'What can I expect during my first visit?',
    a: 'You will receive a fantastic welcome! Our team is known for being extremely friendly and patient, especially with those who have had bad dental experiences in the past. Your first visit is about a thorough, calm assessment of your dental health without any pressure or rushing.',
  },
  {
    q: 'Why should I choose Dental of Valor over other clinics in Anderlecht?',
    a: 'Our patients choose us for our unique combination of "Masterclass" professional expertise and genuine kindness. Whether it is a simple check-up or complex dental prostheses, we treat every patient with meticulous care and reassured patience.',
  },
  {
    q: 'My teeth look fine. Do I still need to go to the dentist?',
    a: 'Yes. Most dental problems, like early gum disease or hidden decay, show no symptoms until they are serious. A routine check at Dental of Valor catches these early, keeping treatment simple and affordable.',
  },
  {
    q: 'I brush every day. Why do I still get cavities?',
    a: 'Brushing only covers about 60% of your teeth. The tight spaces between teeth and under the gum line need professional care. We look at everything — from your brushing habits to diet and genetics — to help you stay cavity-free.',
  },
];

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="faq-section section" id="faq">
      <div className="container">

        <div className="faq-header" data-reveal>
          <span className="section-label">Q&amp;A</span>
          <div className="divider mx-auto" />
          <h2 className="section-title text-center">Questions and Answers</h2>
        </div>

        <div className="faq-list" data-reveal-group>
          {FAQ_DATA.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
                data-reveal-item
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
