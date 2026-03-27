import './Testimonials.css';
import smileSophie from '../assets/smile_sophie.png';
import smileMarc from '../assets/smile_marc.png';
import smileJulie from '../assets/smile_julie.png';

const REVIEWS = [
  {
    name: 'jean volon',
    location: 'Anderlecht',
    initials: 'JV',
    smile: smileSophie,
    rating: 5,
    text: 'Thank you to Dr. Kim for his kindness and meticulous, highly professional care, which ensured the perfect success of my dental prostheses. I take this opportunity to wish him and his entire team all the best for 2026!',
    featured: false,
  },
  {
    name: 'TRunKZ Ds',
    location: 'Anderlecht',
    initials: 'TD',
    smile: smileMarc,
    rating: 5,
    text: 'A master in his field, with reassuring patience and calm for stressed individuals, I highly recommend this dentist. Quality service, a warm welcome 😃 You go in with doubts, you leave with a smile, an unforgettable experience 😉',
    featured: true,
  },
  {
    name: 'Imad Ghali',
    location: 'Anderlecht',
    initials: 'IG',
    smile: smileJulie,
    rating: 5,
    text: 'I arrived full of apprehension after a bad experience with another dentist in Anderlecht. In the end, the welcome was fantastic, the dentist very friendly, and he preferred to wait a little to ensure the anesthesia was perfect, rather than rushing to the next patient and potentially causing pain. And all for very reasonable prices… Masterclass!!',
    featured: false,
  },
];

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="testimonials section" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="container">

        {/* Header */}
        <div className="testimonials__header" data-reveal>
          <span className="section-label">Patient Stories</span>
          <div className="divider" style={{ margin: '0 auto 16px' }} />
          <h2 className="section-title" id="testimonials-heading">
            What our clients say
          </h2>
        </div>

        {/* Cards */}
        <div className="testimonials__grid" data-reveal-group>
          {REVIEWS.map((r, i) => (
            <article
              key={i}
              className={`testimonial-card${r.featured ? ' testimonial-card--featured' : ''}`}
              data-reveal-item
            >
              <span className="testimonial-card__quote" aria-hidden="true">"</span>
              <div className="testimonial-card__stars" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: r.rating }).map((_, j) => (
                  <StarIcon key={j} />
                ))}
              </div>
              <p className="testimonial-card__text">"{r.text}"</p>
              <footer className="testimonial-card__author">
                <div className="testimonial-card__smile-wrap" aria-hidden="true">
                  <img
                    src={r.smile}
                    alt={`${r.name}'s smile after treatment`}
                    className="testimonial-card__smile"
                  />
                </div>
                <div>
                  <div className="testimonial-card__name">{r.name}</div>
                </div>
              </footer>
            </article>
          ))}
        </div>

        <div className="testimonials__cta" data-reveal data-reveal-delay="0.1">
          <div className="testimonials__rating" aria-label="Overall rating: 4.9 from 350 reviews on Google">
            <svg viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span><strong>4.8</strong> · 40+ reviews on Google</span>
          </div>
        </div>

      </div>
    </section>
  );
}
