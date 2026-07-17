"use client";

import RibbonShader from "./RibbonShader";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import PhoneStack from "./PhoneShowcase";
import { createTimeline } from "animejs";

export default function ScrollScene() {
  const [formation, setFormation] = useState(0);
  const [headlineReveal, setHeadlineReveal] = useState(0);
  const [navReveal, setNavReveal] = useState(0);
  const [phoneReveal, setPhoneReveal] = useState(0);
  const [phoneSpread, setPhoneSpread] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const timeline = createTimeline({
      defaults: {
        ease: "outQuart",
      },
    });

    timeline
      .call(() => {
        setFormation(1);
      }, 200)
      .call(() => {
        setNavReveal(1);
      }, 1200)
      .call(() => {
        setHeadlineReveal(1);
      }, 1600)
      .call(() => {
        setPhoneReveal(1);
      }, 2800)
      .call(() => {
        setPhoneSpread(1);
      }, 4200);

    return () => {
      timeline.revert();
    };
  }, []);

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
      <RibbonShader formation={formation} />

      <div
        style={{
          position: "absolute",
          inset: 0,

          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",

          paddingTop: isMobile ? "18vh" : "22vh",

          pointerEvents: "none",
        }}
      >
        <div
          style={{
            opacity: headlineReveal,

            filter: `blur(${(1 - headlineReveal) * 12}px)`,

            transform: `
      translateY(${(1 - headlineReveal) * 40}px)
    `,

            transition: `
      opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 1200ms cubic-bezier(0.22, 1, 0.36, 1),
      filter 1200ms cubic-bezier(0.22, 1, 0.36, 1)
    `,

            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#fff",

              fontSize: "clamp(28px, 2.5vw, 44px)",
              marginRight: "70px",
              transform: isMobile ? "none" : "translateX(-70px)",
              fontWeight: 700,

              lineHeight: 1,

              marginBottom: "1px",
            }}
          >
            Witness the era of
          </div>

          <span
            style={{
              display: "inline-block",

              background: "#fff",
              color: "#000",

              fontWeight: 700,

              fontSize: isMobile ? "18px" : "clamp(22px, 2vw, 34px)",

              padding: isMobile ? "8px 12px" : "6px 14px",

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
