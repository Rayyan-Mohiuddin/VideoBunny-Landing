"use client";

import { useEffect, useRef, useState } from "react";
import { useSmoothedSectionProgress } from "@/hooks/useScrollProgress";

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const progress = useSmoothedSectionProgress(sectionRef, {
    multiplier: 2,
    smoothing: 0.08,
  });

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateMobile();

    window.addEventListener("resize", updateMobile);

    return () => {
      window.removeEventListener("resize", updateMobile);
    };
  }, []);

  const line1 = Math.max(0, Math.min(1, progress / 0.42));

  const line2 = Math.max(0, Math.min(1, (progress - 0.85) / 0.4));

  const bunny = Math.max(0, Math.min(1, (progress - 1.45) / 0.38));

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "250dvh",
        background: "#000",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,

          width: "100%",
          height: "100vh",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            textAlign: "center",

            fontFamily: "SF Pro Display, sans-serif",

            color: "#fff",
          }}
        >
          {/* Line 1 */}
          <div
            style={{
              opacity: line1,

              fontWeight: 400,

              fontSize: isMobile ? "34px" : "52px",

              lineHeight: 1.15,

              letterSpacing: "0",
            }}
          >
            we heard you,
          </div>

          {/* Line 2 */}
          <div
            style={{
              marginTop: isMobile ? "18px" : "26px",

              opacity: line2,

              fontWeight: 400,

              fontSize: isMobile ? "34px" : "52px",

              lineHeight: 1.15,

              letterSpacing: "0",
            }}
          >
            and we bring you{" "}
            <span
              style={{
                opacity: bunny,

                transition: "opacity 120ms linear",

                background:
                  "linear-gradient(90deg, rgba(65,25,194,1) 0%, rgba(250,106,23,1) 55%, rgba(255,255,255,1) 100%)",

                backgroundClip: "text",
                WebkitBackgroundClip: "text",

                color: "transparent",
                WebkitTextFillColor: "transparent",

                fontWeight: 600,

                filter: `
        drop-shadow(0 0 12px rgba(250,106,23,.4))
        drop-shadow(0 0 28px rgba(65,25,194,.3))
      `,
              }}
            >
              Videobunny
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
