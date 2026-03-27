import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import './ServicesPage.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

import imgOrthodontics from '../assets/svc_orthodontics.png';
import imgInvisalign from '../assets/svc_invisalign.png';
import imgLingual from '../assets/svc_lingual.png';
import imgPediatricOrtho from '../assets/svc_pediatric_ortho.png';
import imgImplant from '../assets/svc_implant.png';
import imgGeneral from '../assets/svc_general.png';
import imgMouthguard from '../assets/svc_mouthguard.png';
import imgCosmetic from '../assets/svc_cosmetic2.png';
import imgWhitening from '../assets/svc_whitening.png';
import imgVeneer from '../assets/svc_veneer.png';
import imgCrown from '../assets/svc_crown.png';
import imgPediatric from '../assets/svc_pediatric2.png';
import imgEndodontics from '../assets/svc_endodontics.png';

interface Treatment {
  id: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  benefits: string[];
}

const TREATMENTS: Treatment[] = [
  {
    id: 'orthodontics',
    title: 'Orthodontics',
    tag: 'Alignment',
    description: 'Traditional metal braces to precisely correct misaligned teeth and jaws, improving both bite and appearance.',
    image: imgOrthodontics,
    benefits: [
      'Corrects crowded or crooked teeth',
      'Improves bite and jaw alignment',
      'Long-lasting structural results',
      'Boosts overall dental health and confidence'
    ]
  },
  {
    id: 'invisalign',
    title: 'Invisalign',
    tag: 'Clear Aligners',
    description: 'Removable clear aligners that straighten your teeth discreetly — no brackets, no wires, no compromise.',
    image: imgInvisalign,
    benefits: [
      'Nearly invisible for a discreet look',
      'Removable for easier eating and cleaning',
      'Custom-molded for maximum comfort',
      'Advanced digital planning for precise results'
    ]
  },
  {
    id: 'lingual',
    title: 'Lingual Orthodontics',
    tag: 'Hidden Braces',
    description: 'Braces fitted to the inner surface of your teeth — completely invisible from the outside.',
    image: imgLingual,
    benefits: [
      '100% invisible from the front',
      'High-precision customized brackets',
      'Effective even for complex cases',
      'Always working to straighten your smile'
    ]
  },
  {
    id: 'preventive-ortho',
    title: 'Preventive Orthodontics',
    tag: 'Children',
    description: "Early intervention to guide your child's jaw growth and prevent more complex issues later.",
    image: imgPediatricOrtho,
    benefits: [
      'Guides healthy jaw development',
      'Creates space for permanent teeth',
      'Reduces the need for future extractions',
      'Builds a foundation for a lifelong smile'
    ]
  },
  {
    id: 'implant',
    title: 'Dental Implants',
    tag: 'Restoration',
    description: 'Permanent titanium implants that replace missing teeth — looking, feeling and functioning like your natural tooth.',
    image: imgImplant,
    benefits: [
      'Permanent and stable tooth replacement',
      'Looks and functions like natural teeth',
      'Prevents bone loss in the jaw',
      'No impact on surrounding healthy teeth'
    ]
  },
  {
    id: 'general',
    title: 'General Dentistry',
    tag: 'Comprehensive Care',
    description: 'Full-scope dental care under one roof — from check-ups and hygiene to fillings and extractions.',
    image: imgGeneral,
    benefits: [
      'Comprehensive oral health screenings',
      'Professional cleaning and scaling',
      'Early detection of potential issues',
      'Gentle treatments for everyday care'
    ]
  },
  {
    id: 'mouthguard',
    title: 'Mouthguards',
    tag: 'Protection',
    description: 'Custom-fitted guards to protect teeth during contact sports or prevent damage from night grinding.',
    image: imgMouthguard,
    benefits: [
      'Custom-molded for a perfect fit',
      'Maximum protection during sports',
      'Prevents wear from night grinding (Bruxism)',
      'Durable and long-lasting materials'
    ]
  },
  {
    id: 'cosmetic',
    title: 'Prosthetics & Cosmetics',
    tag: 'Aesthetics',
    description: 'Advanced smile design combining porcelain veneers, crowns and cosmetic bonding for a perfect smile.',
    image: imgCosmetic,
    benefits: [
      'Tailored smile transformations',
      'Natural-looking aesthetic results',
      'Durable and stain-resistant materials',
      'Restores harmony and facial balance'
    ]
  },
  {
    id: 'whitening',
    title: 'Teeth Whitening',
    tag: 'Brightening',
    description: 'Professional in-chair LED whitening that lightens teeth by several shades in a single session.',
    image: imgWhitening,
    benefits: [
      'Safe and non-invasive procedure',
      'Noticeably brighter smile in one visit',
      'Removes deep surface stains',
      'Longer-lasting results than over-the-counter kits'
    ]
  },
  {
    id: 'veneer',
    title: 'Dental Veneers',
    tag: 'Cosmetic',
    description: 'Ultra-thin ceramic shells bonded to the front of teeth to correct shape, colour and minor misalignment.',
    image: imgVeneer,
    benefits: [
      'Corrects chips, gaps, and discolorations',
      'Highly stain-resistant ceramic surface',
      'Minimal removal of natural enamel',
      'Creates a perfectly aligned appearance'
    ]
  },
  {
    id: 'crown',
    title: 'Dental Crowns',
    tag: 'Restoration',
    description: 'Precision-crafted ceramic crowns that restore broken or heavily decayed teeth to full function and aesthetics.',
    image: imgCrown,
    benefits: [
      'Strengthens and protects weak teeth',
      'Perfectly matched to your natural color',
      'Restores full chewing function',
      'Long-term durability and protection'
    ]
  },
  {
    id: 'pediatric',
    title: 'Paediatric Dentistry',
    tag: 'Children',
    description: "Gentle, child-friendly dental care from the very first visit — building healthy habits for life.",
    image: imgPediatric,
    benefits: [
      'Fun and stress-free environment',
      'Focus on early prevention and education',
      'Gentle technique for small smiles',
      'Habit-building for long-term health'
    ]
  },
  {
    id: 'endodontics',
    title: 'Endodontics',
    tag: 'Root Canal',
    description: 'Expert root canal treatment to save infected or damaged teeth, eliminating pain and restoring health.',
    image: imgEndodontics,
    benefits: [
      'Saves your natural tooth structure',
      'Eliminates deep infection and pain',
      'High success rate with modern techniques',
      'Virtually pain-free procedure'
    ]
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Treatment | null>(null);

  const openModal = (t: Treatment) => {
    setSelectedService(t);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedService(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <main className="svc-page">
      {/* ── Hero header ── */}
      <motion.div 
        className="svc-page__hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span className="svc-page__label" variants={itemVariants}>Our Treatments</motion.span>
        <motion.h1 className="svc-page__heading" variants={itemVariants}>
          Everything your smile<br />could ever need.
        </motion.h1>
        <motion.p className="svc-page__sub" variants={itemVariants}>
          From routine check-ups to advanced specialist care — all under one roof, for the whole family.
        </motion.p>
      </motion.div>

      {/* ── Card grid ── */}
      <div className="svc-page__grid container">
        {TREATMENTS.map((t) => (
          <article key={t.id} className="svc-card">
            <div className="svc-card__img-wrap">
              <img src={t.image} alt={t.title} className="svc-card__img" loading="lazy" />
            </div>
            <div className="svc-card__body">
              <span className="svc-card__tag">{t.tag}</span>
              <h2 className="svc-card__title">{t.title}</h2>
              <p className="svc-card__desc">{t.description}</p>
              <button onClick={() => openModal(t)} className="svc-card__link">
                Learn more <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* ── CTA banner ── */}
      <div className="svc-page__cta-band">
        <div className="container svc-page__cta-inner">
          <div>
            <h3 className="svc-page__cta-title">Not sure which treatment you need?</h3>
            <p className="svc-page__cta-sub">Our experts are here to guide you toward the best care.</p>
          </div>
          <Link to="/booking" className="btn-shiny-wrap">
            <span className="btn--shiny">Set Appointment</span>
          </Link>
        </div>
      </div>

      {/* ── Modal Popup ── */}
      <AnimatePresence>
        {selectedService && (
          <div className="svc-modal-overlay" onClick={closeModal}>
            <motion.div 
              className="svc-modal" 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <button className="svc-modal__close" onClick={closeModal} aria-label="Close modal">×</button>
              
              <div className="svc-modal__img-wrap">
                <img src={selectedService.image} alt={selectedService.title} className="svc-modal__img" />
              </div>
              
              <div className="svc-modal__content">
                <span className="svc-card__tag">{selectedService.tag}</span>
                <h2 className="svc-modal__title">{selectedService.title}</h2>
                
                <div className="svc-modal__body-scroll">
                  <p className="svc-modal__desc">{selectedService.description}</p>
                  
                  <div className="svc-modal__benefits">
                    <h4>Key Benefits</h4>
                    <ul>
                      {selectedService.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="svc-modal__actions">
                  <Link to="/booking" className="btn-shiny-wrap" onClick={closeModal}>
                    <span className="btn--shiny">Book this treatment</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
