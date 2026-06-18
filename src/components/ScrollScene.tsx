"use client";

import useScrollProgress from "@/hooks/useScrollProgress";
import RibbonShader from "./RibbonShader";
import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import PhoneStack from "./PhoneShowcase";

export default function ScrollScene() {
  const { progress } = useScrollProgress();

  const targetFormation = Math.min(Math.max((progress - 0.02) / 0.35, 0), 1);

  const formationRef = useRef(0);
  const [, forceUpdate] = useState(0);

  const headlineReveal = Math.min(
    Math.max((formationRef.current - 0.35) / 0.2, 0),
    1,
  );

  const navReveal = Math.min(
    Math.max((formationRef.current - 0.7) / 0.15, 0),
    1,
  );

  const phoneReveal = Math.min(Math.max((progress - 0.65) / 0.15, 0), 1);

  const phoneSpread = Math.min(Math.max((progress - 0.85) / 0.15, 0), 1);
  useEffect(() => {
    let frame: number;

    const animate = () => {
      formationRef.current += (targetFormation - formationRef.current) * 0.06;

      forceUpdate((v) => v + 1);

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, [targetFormation]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <RibbonShader formation={formationRef.current} />

      <div
        style={{
          position: "absolute",
          inset: 0,

          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",

          paddingTop: "18vh",

          pointerEvents: "none",
        }}
      >
        <div
          style={{
            opacity: headlineReveal,
            filter: `blur(${(1 - headlineReveal) * 12}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#fff",

              fontSize: "clamp(28px, 2.5vw, 44px)",
              fontWeight: 700,

              lineHeight: 1,

              marginBottom: "14px",

              transform: "translateX(-70px)",
            }}
          >
            Witness the era of
          </div>

          <span
            style={{
              display: "inline-block",

              background: "#fff",
              color: "#000",

              fontSize: "clamp(22px, 2vw, 34px)",
              fontWeight: 700,

              padding: "6px 14px",

              lineHeight: 1.05,

              borderRadius: 0,
            }}
          >
            Interactive content marketplace
          </span>
        </div>
      </div>

      <Navbar reveal={navReveal} />

      <PhoneStack reveal={phoneReveal} spread={phoneSpread} />
    </div>
  );
}
