import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BeforeAfter.css';

import orthoBefore from '../assets/ba_1_before.png';
import orthoAfter from '../assets/ba_1_after.png';
import veneersBefore from '../assets/ba_3_before.png';
import veneersAfter from '../assets/ba_3_after.png';
import restorationBefore from '../assets/ba_2_before.png';
import restorationAfter from '../assets/ba_2_after.png';

const CASE_STUDIES = [
  { id: 'ortho', before: orthoBefore, after: orthoAfter, label: 'Orthodontics' },
  { id: 'veneers', before: veneersBefore, after: veneersAfter, label: 'Cosmetic Dentistry', link: 'See More' },
  { id: 'restoration', before: restorationBefore, after: restorationAfter, label: 'Dental Restoration' },
];

function ImageSlider({ beforeSrc, afterSrc, caption }: { beforeSrc: string, afterSrc: string, caption?: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const onMouseMove = (e: MouseEvent) => isDragging.current && handleMove(e.clientX);
  const onTouchMove = (e: TouchEvent) => isDragging.current && handleMove(e.touches[0].clientX);

  const onMouseUp = () => { isDragging.current = false; };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, []);

  return (
    <div className="ba-slider-card">
      <div
        className="ba-slider-container"
        ref={containerRef}
        onMouseDown={(e) => {
          isDragging.current = true;
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          isDragging.current = true;
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* AFTER image (bottom layer, fully visible) */}
        <img src={afterSrc} alt="After treatment" className="ba-image ba-image--after" draggable={false} />

        {/* BEFORE image (top layer, clipped horizontally) */}
        <div
          className="ba-image-wrapper ba-image--before"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img src={beforeSrc} alt="Before treatment" className="ba-image" draggable={false} />
        </div>

        {/* The dragger handle overlay */}
        <div
          className="ba-handle"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="ba-handle-line"></div>
          <div className="ba-handle-thumb">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
      
      {caption && (
        <Link to="/coming-soon" className="ba-card-caption">{caption}</Link>
      )}
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <section className="ba-section">
      <div className="container">
        {/* Header exact match to the design */}
        <div className="ba-header">
          <h2 className="ba-title">Before</h2>
          <div className="ba-separator">/</div>
          <h2 className="ba-title">After</h2>
        </div>

        {/* 3 slider cards */}
        <div className="ba-grid">
          {CASE_STUDIES.map((study) => (
            <div key={study.id} className="ba-grid-item">
              <ImageSlider
                beforeSrc={study.before}
                afterSrc={study.after}
                caption={study.link}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
