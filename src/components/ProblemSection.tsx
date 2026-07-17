"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSmoothedSectionProgress } from "@/hooks/useScrollProgress";

import f1 from "@/assets/f1.png";
import f2 from "@/assets/f2.png";
import f3 from "@/assets/f3.png";
import f4 from "@/assets/f4.png";
import f5 from "@/assets/f5.png";
import f6 from "@/assets/f6.png";

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const [time, setTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const progress = useSmoothedSectionProgress(sectionRef, {
    multiplier: 5,
    smoothing: 0.075,
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

  useEffect(() => {
    let frame: number;

    const animate = () => {
      setTime(performance.now() * 0.001);

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, []);

  const imageReveal = Math.max(0, Math.min(1, (progress - 0.25) / 0.8));

  const text1In = Math.max(0, Math.min(1, (progress - 1.35) / 0.45));

  const text1Out = Math.max(0, Math.min(1, (progress - 2.3) / 0.45));

  const text2In = Math.max(0, Math.min(1, (progress - 2.9) / 0.45));

  const text2Out = Math.max(0, Math.min(1, (progress - 4.05) / 0.45));

  const sceneFade = Math.max(0, Math.min(1, (progress - 4.55) / 0.45));

  const photos = [
    // Top center
    {
      src: f1,
      top: "7%",
      left: "50%",
      transform: "translateX(-50%)",
    },

    // Upper left
    {
      src: f2,
      top: "24%",
      left: isMobile ? "4%" : "9%",
    },

    // Upper right
    {
      src: f3,
      top: "20%",
      right: isMobile ? "4%" : "10%",
    },

    // Lower left
    {
      src: f4,
      bottom: "7%",
      left: isMobile ? "6%" : "12%",
    },

    // Lower right
    {
      src: f5,
      bottom: "8%",
      right: isMobile ? "6%" : "11%",
    },

    // Bottom center
    {
      src: f6,
      bottom: "5%",
      left: "50%",
      transform: "translateX(-50%)",
    },
  ];

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "350dvh",
        background: "#000",
        position: "relative",
        // overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,

          width: "100%",
          height: "100vh",

          overflow: "hidden",
        }}
      >
        {photos.map((photo, index) => {
          const floatY = Math.sin(time * (0.7 + index * 0.1) + index) * 12;

          const floatX = Math.cos(time * (0.4 + index * 0.05) + index) * 6;

          const sizes = [110, 136, 122, 142, 116, 128];

          return (
            <div
              key={index}
              style={{
                position: "absolute",

                ...("top" in photo ? { top: photo.top } : {}),
                ...("bottom" in photo ? { bottom: photo.bottom } : {}),
                ...("left" in photo ? { left: photo.left } : {}),
                ...("right" in photo ? { right: photo.right } : {}),

                opacity: Math.pow(imageReveal, 2) * (1 - sceneFade),

                transform: `
      ${photo.transform ?? ""}
      translateX(${floatX}px)
      translateY(
        ${floatY + (1 - imageReveal) * 180}px
      )
      scale(${0.85 + imageReveal * 0.15})
    `,

                willChange: "transform, opacity",

                zIndex: 2,
              }}
            >
              <Image
                src={photo.src}
                alt=""
                style={{
                  width: isMobile ? sizes[index] * 0.6 : sizes[index],
                  height: "auto",

                  borderRadius: "18px",

                  opacity: index % 2 === 0 ? 1 : 0.8,
                }}
              />
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            inset: 0,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            pointerEvents: "none",

            zIndex: 5,
          }}
        >
          {/* Text 1 */}
          <div
            style={{
              position: "absolute",

              width: "100%",

              textAlign: "center",

              opacity: text1In * (1 - text1Out) * (1 - sceneFade),

              transform: `
        translateY(
          ${80 - text1In * 80 - text1Out * 220}px
        )
      `,

              color: "#fff",

              fontSize: isMobile
                ? "clamp(28px,8vw,42px)"
                : "clamp(56px,5vw,92px)",

              fontWeight: 300,

              lineHeight: 1.05,

              letterSpacing: "-0.04em",

              willChange: "transform, opacity",
            }}
          >
            Creators make <em>content</em>
            <br />
            that never gets seen
          </div>

          {/* Text 2 */}
          <div
            style={{
              position: "absolute",

              width: "60%",

              textAlign: "center",

              opacity: text2In * (1 - text2Out) * (1 - sceneFade),

              transform: `
        translateY(
          ${80 - text2In * 80 - text2Out * 220}px
        )
      `,

              color: "#fff",

              fontSize: isMobile
                ? "clamp(28px,8vw,42px)"
                : "clamp(56px,5vw,92px)",

              fontWeight: 300,

              lineHeight: 1.05,

              letterSpacing: "-0.04em",

              willChange: "transform, opacity",
            }}
          >
            Viewers driving the{" "}
            <em
              style={{
                fontStyle: "italic",
              }}
            >
              engagement
            </em>
            <br />
            getting nothing
          </div>
        </div>
      </div>
    </section>
  );
}
