"use client";

import phoneH from "@/assets/phone-home.png";
import phoneC from "@/assets/phone-contest.png";
import phoneL from "@/assets/phone-leaderboard.png";
import Image from "next/image";

type PhoneStackProps = {
  reveal: number;
  spread: number;
};

export default function PhoneStack({ reveal, spread }: PhoneStackProps) {
  const ease = 1 - Math.pow(1 - reveal, 3);
  const revealEase = 1 - Math.pow(1 - reveal, 4);
  const spreadEase = 1 - Math.pow(1 - spread, 3);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,

        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",

        pointerEvents: "none",
      }}
    >
      {/* Left */}
      <div
        style={{
          position: "absolute",

          opacity: spread,

          transform: `
      translateX(${-140 * spread}px)
      translateY(70px)
      scale(${0.9 + spread * 0.1})
      rotate(${-3 * spread}deg)
    `,

          zIndex: 1,
        }}
      >
        <Image
          src={phoneC}
          alt=""
          style={{
            width: 330,
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
      translateX(${140 * spread}px)
      translateY(70px)
      scale(${0.9 + spread * 0.1})
      rotate(${3 * spread}deg)
    `,

          zIndex: 1,
        }}
      >
        <Image
          src={phoneL}
          alt=""
          style={{
            width: 330,
            height: "auto",
            display: "block",
          }}
        />
      </div>

      {/* Center */}
      <div
        style={{
          position: "relative",

          display: reveal > 0 ? "block" : "none",

          transform: `
      translateY(${55 + (1 - ease) * 350}px)
      scale(${0.92 + ease * 0.08})
    `,

          zIndex: 4,
        }}
      >
        <Image
          src={phoneH}
          alt=""
          style={{
            width: 240,
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

          height: "12vh",

          background: `
        linear-gradient(
          to top,
          rgba(0,0,0,1) 0%,
          rgba(0,0,0,1) 35%,
          rgba(0,0,0,0.98) 55%,
          rgba(0,0,0,0.9) 70%,
          rgba(0,0,0,0.55) 85%,
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
