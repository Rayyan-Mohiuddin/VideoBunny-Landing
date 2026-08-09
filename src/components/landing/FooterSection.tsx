"use client";

import { useRef } from "react";
import Image from "next/image";

import FooterCTA from "./FooterCTA";
import FooterJoinButton from "./FooterJoinButton";
import { footerGradient } from "./assets";

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
          aria-hidden
        >
          <Image
            src={footerGradient}
            alt=""
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center bottom",
            }}
          />
        </div>

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
