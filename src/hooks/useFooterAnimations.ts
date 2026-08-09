"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

interface UseFooterAnimationsArgs {
  sectionRef: React.RefObject<HTMLDivElement | null>;

  // Scene 1
  cardRef: React.RefObject<HTMLDivElement | null>;
  textRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  trophyRef: React.RefObject<HTMLDivElement | null>;

  // Scene 2
  joinSceneRef: React.RefObject<HTMLDivElement | null>;
  joinButtonRef: React.RefObject<HTMLButtonElement | null>;
  arrowRef: React.RefObject<HTMLDivElement | null>;
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

/** Linear interpolation. */
const lerp = (start: number, end: number, t: number): number =>
  start + (end - start) * t;

/** Clamp a value between min and max (defaults to 0-1). */
const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, value));

/**
 * Remap `value` from [inMin, inMax] to [outMin, outMax], clamped, with an
 * optional easing curve applied to the normalized (0-1) input before
 * remapping. This is the single primitive every timeline step is built on.
 */
const range = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  ease: (t: number) => number = (t) => t,
): number => {
  const t = clamp((value - inMin) / (inMax - inMin));
  return outMin + (outMax - outMin) * ease(t);
};

// Apple-ish easing curves. Kept local so the hook has zero extra deps.
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutQuint = (t: number): number => 1 - Math.pow(1 - t, 5);
const smoothstep = (t: number): number => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};

// ----------------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------------

export default function useFooterAnimations({
  sectionRef,
  cardRef,
  textRef,
  buttonRef,
  trophyRef,
  joinSceneRef,
  joinButtonRef,
  arrowRef,
}: UseFooterAnimationsArgs) {
  // Smoothed scroll progress state, lives across frames without re-render.
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafId = useRef<number | null>(null);
  const startTime = useRef<number>(0);

  // While a hover micro-interaction owns the join button's transform, the
  // main loop backs off so the two writers never fight over one style prop.
  const hoverLock = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    startTime.current = performance.now();

    // Mark GPU-friendly properties up front so the browser can promote
    // layers ahead of time instead of during the first animated frame.
    [
      cardRef,
      textRef,
      buttonRef,
      trophyRef,
      joinSceneRef,
      joinButtonRef,
      arrowRef,
    ].forEach((ref) => {
      if (ref.current) {
        ref.current.style.willChange = "transform, opacity, filter";
      }
    });

    // --------------------------------------------------------------------
    // Scroll progress (0 -> 1 across the 500vh section)
    // --------------------------------------------------------------------

    const computeTargetProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      return clamp(-rect.top / scrollable);
    };

    const onScroll = () => {
      targetProgress.current = computeTargetProgress();
    };

    // Read once up front in case the page loads mid-scroll (refresh, anchor).
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // --------------------------------------------------------------------
    // Per-frame apply. Every value is a pure function of progress (p) and
    // elapsed time (for idle/ambient motion), so nothing here can drift or
    // desync — scrub the scrollbar and everything snaps to the same place.
    // --------------------------------------------------------------------

    const applyFrame = (p: number, elapsed: number) => {
      const glow = document.getElementById("footer-glow");
      const card = cardRef.current;
      const text = textRef.current;
      const button = buttonRef.current;
      const trophy = trophyRef.current;
      const joinScene = joinSceneRef.current;
      const joinButton = joinButtonRef.current;
      const arrow = arrowRef.current;

      // Scene 1 -> Scene 2 dissolve, shared by every scene-1 element.
      const dissolve = range(p, 0.55, 0.7, 0, 1, easeOutCubic);
      const dissolveBlur = range(p, 0.55, 0.7, 0, 18);
      const dissolveY = lerp(0, -80, dissolve);

      // ---- 0.00 - 0.15  Purple glow reveal --------------------------------
      if (glow) {
        const gOpacity = range(p, 0, 0.15, 0, 1, easeOutCubic);
        const gScale = range(p, 0, 0.15, 1.3, 1, easeOutCubic);
        glow.style.opacity = String(gOpacity);
        glow.style.transform = `scale(${gScale})`;
      }

      // ---- 0.15 - 0.35  CTA card enters, 0.55 - 0.70 dissolves out --------
      if (card) {
        const cOpacity = range(p, 0.15, 0.35, 0, 1, easeOutQuint);
        const cY = range(p, 0.15, 0.35, 60, 0, easeOutQuint);
        const cScale = range(p, 0.15, 0.35, 0.9, 1, easeOutQuint);

        const finalOpacity = cOpacity * (1 - dissolve);
        const finalY = cY + dissolveY;
        const finalScale = lerp(cScale, 0.94, dissolve);

        card.style.opacity = String(finalOpacity);
        card.style.transform = `translateY(${finalY}px) scale(${finalScale})`;
        card.style.filter =
          dissolveBlur > 0.01 ? `blur(${dissolveBlur}px)` : "";
      }

      // ---- 0.22 - 0.40  Heading enters -------------------------------------
      if (text) {
        const tOpacity = range(p, 0.22, 0.4, 0, 1, easeOutQuint);
        const tX = range(p, 0.22, 0.4, -40, 0, easeOutQuint);
        text.style.opacity = String(tOpacity * (1 - dissolve));
        text.style.transform = `translateX(${tX}px)`;
      }

      // ---- 0.30 - 0.45  Button enters (overshoot 0.8 -> 1.05 -> 1) --------
      // then settles into a slow "breathing" idle loop until the dissolve.
      if (button) {
        const bp = range(p, 0.3, 0.45, 0, 1);
        const bOpacity = range(p, 0.3, 0.45, 0, 1, easeOutCubic);
        const bScale =
          bp < 0.6
            ? range(bp, 0, 0.6, 0.8, 1.05, easeOutCubic)
            : range(bp, 0.6, 1, 1.05, 1, easeOutCubic);

        // Idle strength ramps in once the button has settled, and ramps
        // back out as scene 1 dissolves — so it never fights either edge.
        const idleIn = smoothstep(range(p, 0.46, 0.5, 0, 1));
        const idleStrength = prefersReducedMotion ? 0 : idleIn * (1 - dissolve);
        const breathe =
          1 + Math.sin((elapsed / 3) * Math.PI * 2) * 0.01 * idleStrength;

        button.style.opacity = String(bOpacity * (1 - dissolve));
        button.style.transform = `scale(${bScale * breathe})`;
      }

      // ---- 0.40 - 0.55  Trophy drops in, heavy ----------------------------
      // then a slow float/rotate idle loop before the dissolve takes it.
      if (trophy) {
        const trOpacity = range(p, 0.4, 0.55, 0, 1, easeOutQuint);
        const trY = range(p, 0.4, 0.55, 90, 0, easeOutQuint);
        const trRotate = range(p, 0.4, 0.55, -15, 0, easeOutQuint);
        const trScale = range(p, 0.4, 0.55, 0.85, 1, easeOutQuint);

        const idleIn = smoothstep(range(p, 0.56, 0.6, 0, 1));
        const idleStrength = prefersReducedMotion ? 0 : idleIn * (1 - dissolve);
        const floatCycle = (elapsed / 4) * Math.PI * 2;
        const floatY = Math.sin(floatCycle) * 4 * idleStrength;
        const floatRotate = Math.sin(floatCycle) * 1 * idleStrength;

        trophy.style.opacity = String(trOpacity * (1 - dissolve));
        trophy.style.transform = `translateY(${trY + dissolveY + floatY}px) rotate(${
          trRotate + floatRotate
        }deg) scale(${trScale})`;
      }

      // ---- 0.68 - 0.82  Scene 2 fades in -----------------------------------
      if (joinScene) {
        const jOpacity = range(p, 0.68, 0.82, 0, 1, easeOutCubic);
        const jScale = range(p, 0.68, 0.82, 1.05, 1, easeOutCubic);
        joinScene.style.opacity = String(jOpacity);
        joinScene.style.transform = `scale(${jScale})`;

        // Ambient background drift — background-position/size only, so it
        // never touches layout or competes with the scale above.
        if (!prefersReducedMotion) {
          const bgLayer = joinScene.firstElementChild as HTMLElement | null;
          if (bgLayer) {
            const cycle = (elapsed / 26) * Math.PI * 2; // ~26s loop
            const posX = 50 + Math.sin(cycle) * 6;
            const posY = 50 + Math.cos(cycle * 0.7) * 6;
            const size = 110 + Math.sin(cycle * 0.5) * 8;
            bgLayer.style.backgroundPosition = `${posX}% ${posY}%`;
            bgLayer.style.backgroundSize = `${size}%`;
          }
        }
      }

      // ---- 0.82 - 0.95  Videobunny button enters --------------------------
      if (joinButton && !hoverLock.current) {
        const jbOpacity = range(p, 0.82, 0.95, 0, 1, easeOutQuint);
        const jbY = range(p, 0.82, 0.95, 100, 0, easeOutQuint);
        const jbScale = range(p, 0.82, 0.95, 0.8, 1, easeOutQuint);
        joinButton.style.opacity = String(jbOpacity);
        joinButton.style.transform = `translateY(${jbY}px) scale(${jbScale})`;
      }

      // ---- 0.90 - 1.00  Arrow enters ---------------------------------------
      if (arrow) {
        const aOpacity = range(p, 0.9, 1, 0, 1, easeOutCubic);
        const aY = range(p, 0.9, 1, 20, 0, easeOutCubic);
        arrow.style.opacity = String(aOpacity);
        arrow.style.transform = `translateY(${aY}px)`;

        // Stroke-draw only applies if the arrow is an inline <svg><path>.
        // The current markup renders the arrow via next/image (an <img>),
        // which has no strokeDashoffset to animate — this guard makes the
        // hook a no-op there and "just work" if it's swapped for inline SVG.
        const path = arrow.querySelector<SVGPathElement>("path");
        if (path && typeof path.getTotalLength === "function") {
          const length = path.getTotalLength();
          path.style.strokeDasharray = `${length}`;
          path.style.strokeDashoffset = `${length * (1 - aOpacity)}`;
        }
      }
    };

    // --------------------------------------------------------------------
    // rAF loop — one ticker drives the whole section.
    // --------------------------------------------------------------------

    const tick = (now: number) => {
      currentProgress.current = lerp(
        currentProgress.current,
        targetProgress.current,
        0.08,
      );
      const elapsed = (now - startTime.current) / 1000;
      applyFrame(currentProgress.current, elapsed);
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [
    sectionRef,
    cardRef,
    textRef,
    buttonRef,
    trophyRef,
    joinSceneRef,
    joinButtonRef,
    arrowRef,
  ]);

  // --------------------------------------------------------------------
  // Hover "vibration" on the Videobunny button — Anime.js, as specified.
  // Runs independently of the scroll loop; hoverLock stops the two from
  // writing to `transform` on the same element in the same frame.
  // --------------------------------------------------------------------

  useEffect(() => {
    const btn = joinButtonRef.current;
    if (!btn) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const handleEnter = () => {
      hoverLock.current = true;
      animate(btn, {
        rotate: [0, -3, 3, -2, 2, 0],
        scale: [1, 1.03, 1],
        duration: 350,
        ease: "outQuad",
        onComplete: () => {
          hoverLock.current = false;
        },
      });
    };

    btn.addEventListener("mouseenter", handleEnter);
    return () => btn.removeEventListener("mouseenter", handleEnter);
  }, [joinButtonRef]);
}
