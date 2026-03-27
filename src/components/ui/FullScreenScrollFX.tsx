import {
  type CSSProperties,
  type ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FullScreenScrollFX.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type Section = {
  id?: string;
  background: string;
  leftLabel?: ReactNode;
  title: string | ReactNode;
  rightLabel?: ReactNode;
};

type Colors = Partial<{
  text: string;
  overlay: string;
  pageBg: string;
  stageBg: string;
}>;

type Durations = Partial<{
  change: number;
  snap: number;
}>;

export type FullScreenFXAPI = {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  getIndex: () => number;
  refresh: () => void;
};

export type FullScreenFXProps = {
  sections: Section[];
  className?: string;
  style?: CSSProperties;
  fontFamily?: string;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  gap?: number;
  gridPaddingX?: number;
  showProgress?: boolean;
  durations?: Durations;
  reduceMotion?: boolean;
  bgTransition?: "fade" | "wipe";
  parallaxAmount?: number;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
  colors?: Colors;
  apiRef?: React.Ref<FullScreenFXAPI>;
  ariaLabel?: string;
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export const FullScreenScrollFX = forwardRef<HTMLDivElement, FullScreenFXProps>(
  (
    {
      sections,
      className,
      style,
      fontFamily,
      headerLeft,
      headerRight,
      footerLeft,
      footerRight,
      gap = 1,
      gridPaddingX = 3,
      showProgress = true,
      durations = { change: 0.7, snap: 800 },
      reduceMotion,
      bgTransition = "fade",
      parallaxAmount = 4,
      currentIndex,
      onIndexChange,
      initialIndex = 0,
      colors = {
        text: "rgba(235,243,255,0.92)",
        overlay: "rgba(8,18,36,0.50)",
        pageBg: "#ffffff",
        stageBg: "#0d1b2e",
      },
      apiRef,
      ariaLabel = "Full screen scroll slideshow",
    },
    ref
  ) => {
    const total = sections.length;
    const [localIndex, setLocalIndex] = useState(
      clamp(initialIndex, 0, Math.max(0, total - 1))
    );
    const isControlled = typeof currentIndex === "number";
    const index = isControlled
      ? clamp(currentIndex!, 0, Math.max(0, total - 1))
      : localIndex;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const fixedRef = useRef<HTMLDivElement | null>(null);
    const fixedSectionRef = useRef<HTMLDivElement | null>(null);

    const bgRefs = useRef<HTMLImageElement[]>([]);
    const wordRefs = useRef<HTMLSpanElement[][]>([]);

    const leftTrackRef = useRef<HTMLDivElement | null>(null);
    const rightTrackRef = useRef<HTMLDivElement | null>(null);
    const leftItemRefs = useRef<HTMLDivElement[]>([]);
    const rightItemRefs = useRef<HTMLDivElement[]>([]);

    const progressFillRef = useRef<HTMLDivElement | null>(null);
    const currentNumberRef = useRef<HTMLSpanElement | null>(null);

    const lastIndexRef = useRef(index);
    const isAnimatingRef = useRef(false);
    const isSnappingRef = useRef(false);
    const sectionTopRef = useRef<number[]>([]);

    const prefersReduced = useMemo(() => {
      if (typeof window === "undefined") return false;
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }, []);
    const motionOff = reduceMotion ?? prefersReduced;

    // ── Word splitting for GSAP mask animation ──────────────────────────
    const tempWordBucket = useRef<HTMLSpanElement[]>([]);

    const splitWords = (text: string) => {
      const words = text.split(/\s+/).filter(Boolean);
      return words.map((w, i) => (
        <span className="fx-word-mask" key={i}>
          <span
            className="fx-word"
            ref={(el) => { if (el) tempWordBucket.current.push(el); }}
          >
            {w}
          </span>
          {i < words.length - 1 ? "\u00a0" : null}
        </span>
      ));
    };

    // Flush bucket after each render
    const WordsCollector = ({ onReady }: { onReady: () => void }) => {
      useEffect(() => onReady(), []); // eslint-disable-line
      return null;
    };

    // ── Compute snap positions ───────────────────────────────────────────
    const computePositions = () => {
      const el = fixedSectionRef.current;
      if (!el) return;
      const top = el.offsetTop;
      const h = el.offsetHeight;
      const arr: number[] = [];
      for (let i = 0; i < total; i++) arr.push(top + (h * i) / total);
      sectionTopRef.current = arr;
    };

    // ── Center the active list row ───────────────────────────────────────
    const measureRAF = (fn: () => void) => {
      if (typeof window === "undefined") return;
      requestAnimationFrame(() => requestAnimationFrame(fn));
    };

    const measureAndCenterLists = (toIndex = index, animate = true) => {
      const centerTrack = (
        container: HTMLDivElement | null,
        items: HTMLDivElement[],
        trackRef: React.MutableRefObject<HTMLDivElement | null>
      ) => {
        if (!container || items.length === 0 || !trackRef.current) return;
        const first = items[0];
        const second = items[1];
        const contRect = container.getBoundingClientRect();
        let rowH = first.getBoundingClientRect().height;
        if (second) {
          rowH =
            second.getBoundingClientRect().top -
            first.getBoundingClientRect().top;
        }
        const targetY = contRect.height / 2 - rowH / 2 - toIndex * rowH;
        if (animate) {
          gsap.to(trackRef.current, {
            y: targetY,
            duration: (durations.change ?? 0.7) * 0.9,
            ease: "power3.out",
          });
        } else {
          gsap.set(trackRef.current, { y: targetY });
        }
      };

      measureRAF(() => {
        measureRAF(() => {
          centerTrack(leftTrackRef.current, leftItemRefs.current, leftTrackRef);
          centerTrack(rightTrackRef.current, rightItemRefs.current, rightTrackRef);
        });
      });
    };

    // ── Section change animation ─────────────────────────────────────────
    const changeSection = (to: number) => {
      if (to === lastIndexRef.current || isAnimatingRef.current) return;
      const from = lastIndexRef.current;
      const down = to > from;
      isAnimatingRef.current = true;

      if (!isControlled) setLocalIndex(to);
      onIndexChange?.(to);

      if (currentNumberRef.current) {
        currentNumberRef.current.textContent = String(to + 1).padStart(2, "0");
      }
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${(to / (total - 1 || 1)) * 100}%`;
      }

      const D = durations.change ?? 0.7;

      // Word animation
      const outWords = wordRefs.current[from] || [];
      const inWords = wordRefs.current[to] || [];
      if (outWords.length) {
        gsap.to(outWords, {
          yPercent: down ? -100 : 100,
          opacity: 0,
          duration: D * 0.6,
          stagger: down ? 0.03 : -0.03,
          ease: "power3.out",
        });
      }
      if (inWords.length) {
        gsap.set(inWords, { yPercent: down ? 100 : -100, opacity: 0 });
        gsap.to(inWords, {
          yPercent: 0,
          opacity: 1,
          duration: D,
          stagger: down ? 0.05 : -0.05,
          ease: "power3.out",
        });
      }

      // Background transition
      const prevBg = bgRefs.current[from];
      const newBg = bgRefs.current[to];
      if (bgTransition === "fade") {
        if (newBg) {
          gsap.set(newBg, { opacity: 0, scale: 1.04, yPercent: down ? 1 : -1 });
          gsap.to(newBg, {
            opacity: 1,
            scale: 1,
            yPercent: 0,
            duration: D,
            ease: "power2.out",
          });
        }
        if (prevBg) {
          gsap.to(prevBg, {
            opacity: 0,
            yPercent: down ? -parallaxAmount : parallaxAmount,
            duration: D,
            ease: "power2.out",
          });
        }
      } else {
        if (newBg) {
          gsap.set(newBg, {
            opacity: 1,
            clipPath: down ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)",
            scale: 1,
            yPercent: 0,
          });
          gsap.to(newBg, {
            clipPath: "inset(0 0 0 0)",
            duration: D,
            ease: "power3.out",
          });
        }
        if (prevBg) {
          gsap.to(prevBg, {
            opacity: 0,
            duration: D * 0.8,
            ease: "power2.out",
          });
        }
      }

      // List animations
      measureAndCenterLists(to, true);

      leftItemRefs.current.forEach((el, i) => {
        el.classList.toggle("active", i === to);
        gsap.to(el, {
          opacity: i === to ? 1 : 0.28,
          x: i === to ? 10 : 0,
          duration: D * 0.6,
          ease: "power3.out",
        });
      });
      rightItemRefs.current.forEach((el, i) => {
        el.classList.toggle("active", i === to);
        gsap.to(el, {
          opacity: i === to ? 1 : 0.28,
          x: i === to ? -10 : 0,
          duration: D * 0.6,
          ease: "power3.out",
        });
      });

      gsap.delayedCall(D, () => {
        lastIndexRef.current = to;
        isAnimatingRef.current = false;
      });
    };

    // ── Programmatic navigation ──────────────────────────────────────────
    const goTo = (to: number, withScroll = true) => {
      const clamped = clamp(to, 0, total - 1);
      isSnappingRef.current = true;
      changeSection(clamped);

      const pos = sectionTopRef.current[clamped];
      const snapMs = durations.snap ?? 800;

      if (withScroll && typeof window !== "undefined" && pos !== undefined) {
        window.scrollTo({ top: pos, behavior: "smooth" });
        setTimeout(() => (isSnappingRef.current = false), snapMs);
      } else {
        setTimeout(() => (isSnappingRef.current = false), 10);
      }
    };

    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    useImperativeHandle(apiRef, () => ({
      next,
      prev,
      goTo,
      getIndex: () => index,
      refresh: () => ScrollTrigger.refresh(),
    }));

    // ── ScrollTrigger setup ──────────────────────────────────────────────
    useLayoutEffect(() => {
      if (typeof window === "undefined") return;
      const fixed = fixedRef.current;
      const fs = fixedSectionRef.current;
      if (!fixed || !fs || total === 0) return;

      // Init backgrounds
      gsap.set(bgRefs.current, { opacity: 0, scale: 1.04, yPercent: 0 });
      if (bgRefs.current[0]) gsap.set(bgRefs.current[0], { opacity: 1, scale: 1 });

      // Init center words
      wordRefs.current.forEach((words, sIdx) => {
        words.forEach((w) => {
          gsap.set(w, {
            yPercent: sIdx === index ? 0 : 100,
            opacity: sIdx === index ? 1 : 0,
          });
        });
      });

      computePositions();
      measureAndCenterLists(index, false);

      const st = ScrollTrigger.create({
        trigger: fs,
        start: "top top",
        end: "bottom bottom",
        pin: fixed,
        pinSpacing: true,
        onUpdate: (self) => {
          if (motionOff || isSnappingRef.current) return;
          const prog = self.progress;
          const target = Math.min(total - 1, Math.floor(prog * total));
          if (target !== lastIndexRef.current && !isAnimatingRef.current) {
            const next = lastIndexRef.current + (target > lastIndexRef.current ? 1 : -1);
            goTo(next, false);
          }
          if (progressFillRef.current) {
            progressFillRef.current.style.width = `${
              (lastIndexRef.current / (total - 1 || 1)) * 100
            }%`;
          }
        },
      });

      const ro = new ResizeObserver(() => {
        computePositions();
        measureAndCenterLists(lastIndexRef.current, false);
        ScrollTrigger.refresh();
      });
      ro.observe(fs);

      return () => {
        ro.disconnect();
        st.kill();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total, initialIndex, motionOff, bgTransition, parallaxAmount]);

    // ── Mount entrance stagger ───────────────────────────────────────────
    useEffect(() => {
      leftItemRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: i === index ? 1 : 0.28,
            y: 0,
            duration: 0.6,
            delay: i * 0.08,
            ease: "power3.out",
          }
        );
      });
      rightItemRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: i === index ? 1 : 0.28,
            y: 0,
            duration: 0.6,
            delay: 0.2 + i * 0.08,
            ease: "power3.out",
          }
        );
      });
      measureAndCenterLists(index, false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── CSS variables ────────────────────────────────────────────────────
    const cssVars: CSSProperties = {
      ["--fx-font" as string]: fontFamily ?? "inherit",
      ["--fx-text" as string]: colors.text ?? "rgba(235,243,255,0.92)",
      ["--fx-overlay" as string]: colors.overlay ?? "rgba(8,18,36,0.50)",
      ["--fx-page-bg" as string]: colors.pageBg ?? "#ffffff",
      ["--fx-stage-bg" as string]: colors.stageBg ?? "#0d1b2e",
      ["--fx-gap" as string]: `${gap}rem`,
      ["--fx-grid-px" as string]: `${gridPaddingX}rem`,
    };

    // ── Render ───────────────────────────────────────────────────────────
    return (
      <div
        ref={(node) => {
          (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node!);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={["fx", className].filter(Boolean).join(" ")}
        style={{ ...cssVars, ...style }}
        aria-label={ariaLabel}
      >
        <div className="fx-scroll">
          {/* Pinned section (height = (total+1) * 100vh) */}
          <div
            className="fx-fixed-section"
            ref={fixedSectionRef}
            style={{ height: `${(total + 1) * 100}vh` }}
          >
            <div className="fx-fixed" ref={fixedRef}>
              {/* Backgrounds */}
              <div className="fx-bgs" aria-hidden="true">
                {sections.map((s, i) => (
                  <div className="fx-bg" key={s.id ?? i}>
                    <img
                      ref={(el) => { if (el) bgRefs.current[i] = el; }}
                      src={s.background}
                      alt=""
                      className="fx-bg-img"
                    />
                    <div className="fx-bg-overlay" />
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="fx-grid">
                {/* Header */}
                <div className="fx-header">
                  <span>{headerLeft}</span>
                  <span>{headerRight}</span>
                </div>

                {/* Content */}
                <div className="fx-content">
                  {/* Left list */}
                  <div className="fx-left">
                    <div className="fx-track" ref={leftTrackRef}>
                      {sections.map((s, i) => (
                        <div
                          key={`L-${s.id ?? i}`}
                          className={`fx-item fx-left-item ${i === index ? "active" : ""}`}
                          ref={(el) => { if (el) leftItemRefs.current[i] = el; }}
                          onClick={() => goTo(i)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && goTo(i)}
                          aria-pressed={i === index}
                        >
                          {s.leftLabel}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Center */}
                  <div className="fx-center">
                    {sections.map((s, sIdx) => {
                      tempWordBucket.current = [];
                      const isString = typeof s.title === "string";
                      return (
                        <div
                          key={`C-${s.id ?? sIdx}`}
                          className={`fx-featured ${sIdx === index ? "active" : ""}`}
                        >
                          <h3 className="fx-featured-title">
                            {isString ? splitWords(s.title as string) : s.title}
                          </h3>
                          <WordsCollector
                            onReady={() => {
                              if (tempWordBucket.current.length) {
                                wordRefs.current[sIdx] = [...tempWordBucket.current];
                              }
                              tempWordBucket.current = [];
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Right list */}
                  <div className="fx-right">
                    <div className="fx-track" ref={rightTrackRef}>
                      {sections.map((s, i) => (
                        <div
                          key={`R-${s.id ?? i}`}
                          className={`fx-item fx-right-item ${i === index ? "active" : ""}`}
                          ref={(el) => { if (el) rightItemRefs.current[i] = el; }}
                          onClick={() => goTo(i)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && goTo(i)}
                          aria-pressed={i === index}
                        >
                          {s.rightLabel}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="fx-footer">
                  <span className="fx-footer-left">{footerLeft}</span>
                  {showProgress && (
                    <div className="fx-progress">
                      <div className="fx-progress-numbers">
                        <span ref={currentNumberRef}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>/ {String(total).padStart(2, "0")}</span>
                      </div>
                      <div className="fx-progress-bar">
                        <div className="fx-progress-fill" ref={progressFillRef} />
                      </div>
                    </div>
                  )}
                  <span className="fx-footer-right">{footerRight}</span>
                </div>
              </div>
            </div>
          </div>

          {/* End spacer */}
          <div className="fx-end" />
        </div>
      </div>
    );
  }
);

FullScreenScrollFX.displayName = "FullScreenScrollFX";
