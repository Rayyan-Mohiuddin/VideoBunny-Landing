"use client";

import { useRef } from "react";

import FooterCTA from "./FooterCTA";
import FooterJoinButton from "./FooterJoinButton";

import useFooterAnimations from "@/hooks/useFooterAnimations";

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scene 1
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const trophyRef = useRef<HTMLDivElement>(null);

  // Scene 2
  const joinSceneRef = useRef<HTMLDivElement>(null);
  const joinButtonRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useFooterAnimations({
    sectionRef,

    cardRef,
    textRef,
    buttonRef,
    trophyRef,

    joinSceneRef,
    joinButtonRef,
    arrowRef,
  });

  return (
    <section ref={sectionRef} className="relative h-[500vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Background glow */}
        <div
          id="footer-glow"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
      radial-gradient(
        ellipse 80% 55% at 50% 85%,
        rgba(65,112,241,.32) 0%,
        rgba(68,65,241,.18) 35%,
        rgba(68,65,241,.08) 55%,
        transparent 75%
      )
    `,
            filter: "blur(90px)",
          }}
        />

        {/* CTA Scene */}

        <FooterCTA
          cardRef={cardRef}
          textRef={textRef}
          buttonRef={buttonRef}
          trophyRef={trophyRef}
        />

        {/* Join Scene */}

        <FooterJoinButton
          sceneRef={joinSceneRef}
          buttonRef={joinButtonRef}
          arrowRef={arrowRef}
        />
      </div>
    </section>
  );
}
