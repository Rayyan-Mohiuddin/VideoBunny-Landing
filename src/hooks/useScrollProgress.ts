"use client";

import { useEffect, useState } from "react";

export default function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let previousTime = performance.now();

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

      setProgress(scrollTop / maxScroll);
    };

    update();

    window.addEventListener("scroll", update);

    return () => window.removeEventListener("scroll", update);
  }, []);

  return {
    progress,
    scrollVelocity,
  };
}
