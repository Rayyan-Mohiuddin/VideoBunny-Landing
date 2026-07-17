"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export function useSmoothedSectionProgress(
  sectionRef: RefObject<HTMLElement | null>,
  {
    multiplier = 1,
    smoothing = 0.085,
  }: {
    multiplier?: number;
    smoothing?: number;
  } = {},
) {
  const [progress, setProgress] = useState(0);
  const targetProgress = useRef(0);
  const smoothedProgress = useRef(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const section = sectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const totalScrollable = rect.height - viewport;
      const current = Math.min(Math.max(-rect.top, 0), totalScrollable);

      targetProgress.current =
        totalScrollable > 0 ? clamp01(current / totalScrollable) * multiplier : 0;
    };

    const tick = () => {
      smoothedProgress.current +=
        (targetProgress.current - smoothedProgress.current) * smoothing;

      setProgress((previous) => {
        if (Math.abs(previous - smoothedProgress.current) < 0.001) {
          return previous;
        }

        return smoothedProgress.current;
      });

      frame.current = requestAnimationFrame(tick);
    };

    measure();
    frame.current = requestAnimationFrame(tick);

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);

      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, [multiplier, sectionRef, smoothing]);

  return progress;
}

export default function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const targetProgress = useRef(0);
  const smoothedProgress = useRef(0);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let previousTime = performance.now();
    let frame: number;

    const update = () => {
      const scrollTop = window.scrollY;
      const currentTime = performance.now();

      const deltaY = scrollTop - previousScrollY;

      const deltaTime = currentTime - previousTime;

      const velocity = deltaTime > 0 ? Math.abs(deltaY / deltaTime) : 0;

      setScrollVelocity(velocity);

      previousScrollY = scrollTop;
      previousTime = currentTime;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      targetProgress.current = maxScroll > 0 ? scrollTop / maxScroll : 0;
    };

    const tick = () => {
      smoothedProgress.current +=
        (targetProgress.current - smoothedProgress.current) * 0.085;

      setProgress((previous) => {
        if (Math.abs(previous - smoothedProgress.current) < 0.001) {
          return previous;
        }

        return smoothedProgress.current;
      });

      frame = requestAnimationFrame(tick);
    };

    update();
    tick();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  return {
    progress,
    scrollVelocity,
  };
}
