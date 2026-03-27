"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react";
import './MouseFollowingEyes.css';

const MouseFollowingEyes: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const eye1Ref = useRef<HTMLDivElement>(null);
  const eye2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Watch global mouse movement so the eyes track anywhere on screen
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="mfe-eyes-wrapper">
      <Eye
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        selfRef={eye1Ref as React.RefObject<HTMLDivElement>}
        otherRef={eye2Ref as React.RefObject<HTMLDivElement>}
      />
      <Eye
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        selfRef={eye2Ref as React.RefObject<HTMLDivElement>}
        otherRef={eye1Ref as React.RefObject<HTMLDivElement>}
      />
    </div>
  );
};

interface EyeProps {
  mouseX: number;
  mouseY: number;
  selfRef: React.RefObject<HTMLDivElement>;
  otherRef: React.RefObject<HTMLDivElement>;
}

const Eye: React.FC<EyeProps> = ({ mouseX, mouseY, selfRef, otherRef }) => {
  const pupilRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });

  const updateCenter = () => {
    if (!selfRef.current) return;
    const rect = selfRef.current.getBoundingClientRect();
    setCenter({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  useEffect(() => {
    updateCenter();
    window.addEventListener("resize", updateCenter);
    // ensure center is caught correctly after rendering
    setTimeout(updateCenter, 100); 
    return () => window.removeEventListener("resize", updateCenter);
  }, []);

  useEffect(() => {
    updateCenter();

    const isInside = (ref: React.RefObject<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return false;
      return (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
      );
    };

    if (isInside(selfRef) || isInside(otherRef)) return;

    const dx = mouseX - center.x;
    const dy = mouseY - center.y;
    const angle = Math.atan2(dy, dx);

    const maxMove = 20;
    const pupilX = Math.cos(angle) * maxMove;
    const pupilY = Math.sin(angle) * maxMove;

    if (pupilRef.current) {
      pupilRef.current.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    }
  }, [mouseX, mouseY, center.x, center.y, selfRef, otherRef]);

  return (
    <div ref={selfRef} className="mfe-eye">
      <div ref={pupilRef} className="mfe-pupil">
        <div className="mfe-pupil-highlight"></div>
      </div>
    </div>
  );
};

export { MouseFollowingEyes };
