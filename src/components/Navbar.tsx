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

        zIndex: 20,
      }}
    >
      <Image src={logo} alt="Videobunny" style={{ width: "160px" }} />
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

          borderRadius: 999,

          padding: "12px 30px",

          fontSize: 16,

          fontWeight: 600,

          cursor: "pointer",

          boxShadow: "0 0 24px rgba(255,210,70,.65)",
        }}
      >
        Join waitlist
      </button>
    </nav>
  );
}
