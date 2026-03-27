import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import './Hero.css';
import heroClinic from '../assets/hero_clinic_interior.png';

const HERO_SMILE =
  'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&auto=format&fit=crop&q=80';

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const imageVariants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__inner">

        {/* ── Left: Text content ── */}
        <motion.div
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero__title" variants={itemVariants}>
            Premium Dental Care<br />
            in Anderlecht.
          </motion.h1>

          <motion.p className="hero__description" variants={itemVariants}>
            Expert care for all your dental needs. From routine check-ups to
            advanced restorations — we care for your smile with precision and warmth.
          </motion.p>

          <motion.div className="hero__actions" variants={itemVariants}>
            <Link to="/booking" className="btn-shiny-wrap">
              <span className="btn--shiny">Set Appointment</span>
            </Link>
            <Link to="/services" className="hero__learn-more">
              View services →
            </Link>
          </motion.div>

          <motion.div className="hero__trust" variants={itemVariants}>
            <div className="hero__trust-avatars">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="hero__trust-avatar">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Happy patient" />
                </div>
              ))}
            </div>
            <div className="hero__trust-text">
              Trusted by 2,000+ patients in Anderlecht<br />
              Serving the community since 2012
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: image collage ── */}
        <motion.div
          className="hero__collage"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Floating blobs */}
          <motion.div className="hero__blob hero__blob--top"    variants={floatVariants} animate="animate" />
          <motion.div className="hero__blob hero__blob--bottom" variants={floatVariants} animate="animate" style={{ animationDelay: '0.5s' }} />
          <motion.div className="hero__blob hero__blob--side"   variants={floatVariants} animate="animate" style={{ animationDelay: '1s' }} />

          {/* Clinic interior */}
          <motion.div
            className="hero__col-img hero__col-img--top"
            style={{ transformOrigin: 'bottom center' }}
            variants={imageVariants}
            whileHover={{ scale: 1.03, rotate: -0.5, transition: { duration: 0.35 } }}
          >
            <img src={heroClinic} alt="Modern dental clinic interior" />
          </motion.div>

          {/* Smile close-up */}
          <motion.div
            className="hero__col-img hero__col-img--bottom"
            style={{ transformOrigin: 'top right' }}
            variants={imageVariants}
            whileHover={{ scale: 1.04, rotate: 0.5, transition: { duration: 0.35 } }}
          >
            <img src={HERO_SMILE} alt="Beautiful confident smile" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
