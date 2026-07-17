"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import leftPhone from "@/assets/left-phone.png";
import { useSmoothedSectionProgress } from "@/hooks/useScrollProgress";

export default function ViewerSection() {
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

  // PHONE INTRO

  const phoneOpacity = progress < 0.16 ? progress / 0.16 : 1;

  const phoneScale =
    progress < 0.16
      ? 1.08
      : progress < 0.72
        ? 1
        : progress < 0.88
          ? 1 - ((progress - 0.72) / 0.16) * 0.18
          : 0.82;

  const phoneX =
    progress < 0.72 ? 0 : -((progress - 0.72) / 0.16) * (isMobile ? 0 : 220);

  const phoneY = progress < 0.16 ? 50 - (progress / 0.16) * 50 : 0;

  const phoneRotate =
    progress < 0.55 ? -6 : -6 + ((progress - 0.55) / 0.23) * 4;

  // HEADING

  const headingOpacity = progress < 0.6 ? 0 : Math.min((progress - 0.6) * 8, 1);

  const subtitleOpacity =
    progress < 0.7 ? 0 : Math.min((progress - 0.7) * 8, 1);

  // EXIT

  const exit = progress < 0.96 ? 1 : 1 - (progress - 0.96) / 0.04;

  const breathing = 1 + Math.sin(progress * 40) * 0.004;

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

          justifyContent: "space-between",
          alignItems: "center",

          padding: isMobile ? "60px 24px" : "0 8vw",

          overflow: "hidden",
        }}
      >
        {/* PHONE */}

        <div
          style={{
            flex: 1,

            order: isMobile ? 2 : 1,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            opacity: phoneOpacity * exit,

            transform: `
              translateX(${phoneX}px)
              translateY(${phoneY}px)
              rotate(${phoneRotate}deg)
              scale(${phoneScale * breathing})
            `,

            willChange: "transform, opacity",

            filter: "drop-shadow(0 45px 120px rgba(0,0,0,.55))",
          }}
        >
          <Image
            src={leftPhone}
            alt="Viewer Engagement"
            priority
            style={{
              width: isMobile ? 320 : 520,
              height: "auto",
              display: "block",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* TEXT */}

        <div
          style={{
            flex: 1,

            order: isMobile ? 1 : 2,

            textAlign: isMobile ? "center" : "left",

            marginTop: isMobile ? 0 : 0,

            opacity: headingOpacity * exit,

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

              fontWeight: 400,

              lineHeight: 1.08,

              fontSize: isMobile
                ? "clamp(34px,8vw,46px)"
                : "clamp(48px,4vw,64px)",
            }}
          >
            <span
              style={{
                fontStyle: "italic",
              }}
            >
              Viewers
            </span>{" "}
            engage with
            <br />
            content
          </h2>

          <p
            style={{
              marginTop: 24,

              color: "#bdbdbd",

              lineHeight: 1.7,

              fontSize: isMobile ? 15 : 18,

              opacity: subtitleOpacity * exit,

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
      </div>
    </section>
  );
}
