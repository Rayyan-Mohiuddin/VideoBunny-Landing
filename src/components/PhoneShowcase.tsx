"use client";

import phoneH from "@/assets/phone-home.png";
import phoneC from "@/assets/phone-contest.png";
import phoneL from "@/assets/phone-leaderboard.png";
import { useEffect, useState } from "react";
import Image from "next/image";

type PhoneStackProps = {
  reveal: number;
  spread: number;
};

export default function PhoneStack({ reveal, spread }: PhoneStackProps) {
  const ease = 1 - Math.pow(1 - reveal, 3);
  const [isMobile, setIsMobile] = useState(false);
  const fanout = isMobile ? 110 : 140;
  const restingY = isMobile ? -28 : 135;

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

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,

        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",

        pointerEvents: "none",

        transform: isMobile ? "translateY(18px) scale(0.78)" : "scale(1)",

        transformOrigin: "bottom center",
      }}
    >
      {/* Left */}
      <div
        style={{
          position: "absolute",

          opacity: spread,

          transform: `
      translateX(${-fanout * spread}px)
      translateY(${isMobile ? -42 : 150}px)
      scale(${0.9 + spread * 0.1})
      rotate(${4 * spread}deg)
    `,

          zIndex: 1,

          transition: `
  opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1),
  transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)
`,
        }}
      >
        <Image
          src={phoneC}
          alt=""
          style={{
            width: isMobile ? 220 : 330,
            height: "auto",
            display: "block",
          }}
        />
      </div>

      {/* Right */}
      <div
        style={{
          position: "absolute",

          opacity: spread,

          transform: `
      translateX(${fanout * spread}px)
      translateY(${isMobile ? -42 : 150}px)
      scale(${0.9 + spread * 0.1})
      rotate(${-4 * spread}deg)
    `,

          zIndex: 1,

          transition: `
  opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1),
  transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)
`,
        }}
      >
        <Image
          src={phoneL}
          alt=""
          style={{
            width: isMobile ? 220 : 330,
            height: "auto",
            display: "block",
          }}
        />
      </div>

      {/* Center */}
      <div
        style={{
          position: "relative",

          opacity: reveal,

          transform: `
      translateY(${restingY + (1 - ease) * 350}px)
      scale(${0.92 + ease * 0.08})
    `,

          transition: `
      opacity 1400ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 1400ms cubic-bezier(0.22, 1, 0.36, 1)
    `,

          zIndex: 4,
        }}
      >
        <Image
          src={phoneH}
          alt=""
          style={{
            width: isMobile ? 180 : 240,
            height: "auto",
            display: "block",
          }}
        />
      </div>

      {/* Global darkness layer */}
      <div
        style={{
          position: "absolute",

          left: 0,
          right: 0,
          bottom: 0,

          height: isMobile ? "32vh" : "12vh",

          background: `
          linear-gradient(
            to top,
            rgba(0,0,0,1) 0%,
            rgba(0,0,0,1) 45%,
            rgba(0,0,0,0.98) 65%,
            rgba(0,0,0,0.85) 80%,
            rgba(0,0,0,0.45) 92%,
            transparent 100%
          )
          `,

          pointerEvents: "none",

          zIndex: 5,
        }}
      />
    </div>
  );
}
