"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import PhoneStack from "./PhoneShowcase";
import HeroWaitlistButton from "./HeroWaitlistButton";
import FlickingFeedIcon from "./FlickingFeedIcon";
import { createTimeline } from "animejs";
import heroBgDesktop from "@/assets/hero-bg-desktop.svg";

export default function ScrollScene() {
  const [headlineReveal, setHeadlineReveal] = useState(0);
  const [navReveal, setNavReveal] = useState(0);
  const [phoneReveal, setPhoneReveal] = useState(0);
  const [phoneSpread, setPhoneSpread] = useState(0);
  const [ctaReveal, setCtaReveal] = useState(0);
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
      }, 4200)
      .call(() => {
        setCtaReveal(1);
      }, 4800);

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
        background: "#070707",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <Image
          src={heroBgDesktop}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            // Desktop: horizon glow sits mid-lower behind phones.
            // Mobile: shift up so the purple bloom fills the upper mid area.
            objectPosition: isMobile ? "center 28%" : "center center",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,

          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",

          paddingTop: isMobile ? "14vh" : "16vh",
          paddingLeft: isMobile ? 24 : 64,
          paddingRight: isMobile ? 24 : 64,

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

            textAlign: "left",
            maxWidth: isMobile ? 340 : 920,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: isMobile ? 8 : 18,
            }}
          >
            <h1
              style={{
                margin: 0,
                color: "#fff",
                fontSize: isMobile
                  ? "clamp(34px, 9vw, 44px)"
                  : "clamp(44px, 4.6vw, 68px)",
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
              }}
            >
              {isMobile ? (
                <>
                  Content should be more then just{" "}
                  <em style={{ fontStyle: "italic", fontWeight: 400 }}>
                    Scrolling videos
                  </em>
                </>
              ) : (
                <>
                  Content should be more
                  <br />
                  then just{" "}
                  <em style={{ fontStyle: "italic", fontWeight: 400 }}>
                    Scrolling videos
                  </em>
                </>
              )}
            </h1>

            <div
              style={{
                marginTop: isMobile ? 8 : 6,
                flexShrink: 0,
              }}
            >
              <FlickingFeedIcon
                width={isMobile ? 42 : 54}
                height={isMobile ? 92 : 110}
              />
            </div>
          </div>
        </div>
      </div>

      <Navbar reveal={navReveal} />

      <PhoneStack reveal={phoneReveal} spread={phoneSpread} />

      <HeroWaitlistButton reveal={ctaReveal} isMobile={isMobile} />
    </div>
  );
}
