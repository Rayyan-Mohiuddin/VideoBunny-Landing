"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import phoneImage from "@/assets/two-hand-phone.png";
import { useSmoothedSectionProgress } from "@/hooks/useScrollProgress";

export default function CreatorSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const progress = useSmoothedSectionProgress(sectionRef, {
    smoothing: 0.075,
  });

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
    };

    update();

    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  const sectionOffset = progress < 0.15 ? (1 - progress / 0.15) * 180 : 0;

  const phoneOpacity = progress < 0.18 ? progress / 0.18 : 1;

  const phoneScale =
    progress < 0.25
      ? 1.08
      : progress < 0.72
        ? 1
        : 1 - ((progress - 0.72) / 0.28) * 0.82;

  const phoneY = progress < 0.25 ? 40 - (progress / 0.25) * 40 : 0;

  const headingOpacity =
    progress < 0.28 ? 0 : Math.min((progress - 0.28) * 4.5, 1);

  const subtitleOpacity =
    progress < 0.42 ? 0 : Math.min((progress - 0.42) * 4.5, 1);

  const fadeOut = progress > 0.82 ? 1 - (progress - 0.82) / 0.18 : 1;

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "320vh",
        background: "#000",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",

          display: "flex",
          flexDirection: isMobile ? "column" : "row",

          alignItems: "center",
          justifyContent: "space-between",

          padding: isMobile ? "50px 24px" : "0 8vw",

          overflow: "hidden",

          transform: `translateY(${sectionOffset}px)`,
          willChange: "transform",
        }}
      >
        {/* LEFT */}

        <div
          style={{
            flex: 1,

            order: isMobile ? 1 : 0,

            textAlign: isMobile ? "center" : "left",

            opacity: headingOpacity * fadeOut,

            transform: `
              translateX(${40 - headingOpacity * 40}px)
            `,

            willChange: "transform, opacity",
          }}
        >
          <h2
            style={{
              margin: 0,

              color: "#fff",

              lineHeight: 1.05,

              fontWeight: 400,

              fontSize: isMobile
                ? "clamp(34px,8vw,46px)"
                : "clamp(46px,4vw,64px)",
            }}
          >
            <span
              style={{
                fontStyle: "italic",
              }}
            >
              Creator
            </span>{" "}
            upload the
            <br />
            content
          </h2>

          <p
            style={{
              marginTop: 26,

              color: "#b8b8b8",

              lineHeight: 1.7,

              fontSize: isMobile ? 15 : 18,

              opacity: subtitleOpacity * fadeOut,

              transform: `
                translateY(${24 - subtitleOpacity * 24}px)
              `,

              willChange: "transform, opacity",
            }}
          >
            Get into the contest. Mainly of 2 types,
            <br />
            creator and viewer.
          </p>
        </div>

        {/* RIGHT */}

        <div
          style={{
            flex: 1,

            order: isMobile ? 2 : 1,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            marginTop: isMobile ? 50 : 0,

            opacity: phoneOpacity * fadeOut,

            transform: `
              translateY(${phoneY}px)
              scale(${phoneScale})
            `,

            willChange: "transform, opacity",
          }}
        >
          <Image
            src={phoneImage}
            alt="Creator Upload"
            priority
            style={{
              width: isMobile ? 320 : 540,
              height: "auto",
              display: "block",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}
