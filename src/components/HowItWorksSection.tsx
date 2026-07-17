"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import handPhone from "@/assets/hand-phone.png";
import { useSmoothedSectionProgress } from "@/hooks/useScrollProgress";

export default function HowItWorksSection() {
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

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  const phoneOpacity = progress < 0.2 ? progress / 0.2 : 1;

  const phoneScale =
    progress < 0.82 ? 1.2 : 1.2 - ((progress - 0.75) / 0.15) * 0.34;

  const phoneY = progress < 0.4 ? 0 - progress * 120 : -35;

  const headingOpacity =
    progress < 0.78 ? 0 : Math.min((progress - 0.78) * 10, 1);

  const bottomOpacity =
    progress < 0.9 ? 0 : Math.min((progress - 0.84) * 10, 1);

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
          flexDirection: "column",

          alignItems: "center",
          justifyContent: "center",

          overflow: "hidden",
        }}
      >
        {/* TOP HEADING */}

        <div
          style={{
            position: "absolute",

            top: isMobile ? "3%" : "0%",

            textAlign: "center",

            opacity: headingOpacity,

            transform: `
              translateY(${40 - headingOpacity * 40}px)
            `,

            willChange: "transform, opacity",
          }}
        >
          <h2
            style={{
              margin: 0,

              color: "#fff",

              fontWeight: 400,

              fontSize: isMobile
                ? "clamp(32px,8vw,44px)"
                : "clamp(42px,4vw,60px)",

              lineHeight: 1.05,
            }}
          >
            How{" "}
            <span
              style={{
                fontStyle: "italic",
              }}
            >
              videobunny
            </span>
            <br />
            works
          </h2>
        </div>

        {/* PHONE */}

        <div
          style={{
            opacity: phoneOpacity,

            transform: `
              translateY(${phoneY}px)
              scale(${phoneScale})
            `,

            willChange: "transform, opacity",
          }}
        >
          <Image
            src={handPhone}
            alt="Videobunny Contest"
            priority
            style={{
              width: isMobile ? 250 : 400,
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* BOTTOM TEXT */}

        <div
          style={{
            position: "absolute",

            bottom: isMobile ? "6%" : "3%",

            textAlign: "center",

            opacity: bottomOpacity,

            transform: `
              translateY(${30 - bottomOpacity * 30}px)
            `,

            willChange: "transform, opacity",
          }}
        >
          <h3
            style={{
              margin: 0,

              color: "#fff",

              fontWeight: 400,

              fontSize: isMobile ? 24 : 32,
            }}
          >
            Join the{" "}
            <span
              style={{
                fontStyle: "italic",
              }}
            >
              live contest
            </span>
          </h3>

          <p
            style={{
              marginTop: 12,

              color: "#bdbdbd",

              lineHeight: 1.6,

              fontSize: isMobile ? 14 : 16,
            }}
          >
            Get into the contest. Mainly of 2 types,
            <br />
            creator and viewer
          </p>
        </div>
      </div>
    </section>
  );
}
