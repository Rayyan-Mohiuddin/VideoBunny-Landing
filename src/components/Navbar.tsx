"use client";

import logo from "@/assets/logo.png";
import Image from "next/image";

type NavbarProps = {
  reveal: number;
};

export default function Navbar({ reveal }: NavbarProps) {
  return (
    <nav
      style={{
        position: "absolute",
        top: "clamp(20px, 3vw, 32px)",
        left: "clamp(20px, 5vw, 60px)",
        right: "clamp(20px, 5vw, 60px)",

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        opacity: reveal,

        filter: `blur(${(1 - reveal) * 8}px)`,

        transform: `
  translateY(${(1 - reveal) * -25}px)
`,

        transition: `
  opacity 900ms ease,
  transform 900ms ease,
  filter 900ms ease
`,

        zIndex: 20,
      }}
    >
      <Image
        src={logo}
        alt="Videobunny"
        style={{
          width: "clamp(110px, 18vw, 160px)",
          height: "auto",
        }}
      />
      {/* <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <img src="logo" alt="" />
        <span
          style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Videobunny
        </span>
      </div> */}

      <button
        style={{
          background: "#fff",
          color: "#000",

          border: "none",

          borderRadius: 12,

          padding: "clamp(8px,1.8vw,12px) clamp(18px,3vw,30px)",

          fontSize: 16,

          fontWeight: 800,

          cursor: "pointer",


        }}
      >
        Join the waitlist
      </button>
    </nav>
  );
}
