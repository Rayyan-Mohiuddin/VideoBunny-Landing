"use client";

import Image from "next/image";
import { forwardRef } from "react";

import { trophy } from "./assets";

interface FooterCTAProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  textRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  trophyRef: React.RefObject<HTMLDivElement | null>;
}

const FooterCTA = forwardRef<HTMLDivElement, FooterCTAProps>(
  ({ cardRef, textRef, buttonRef, trophyRef }, _) => {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={cardRef}
          className="relative w-[82vw] max-w-[1200px] h-[560px] rounded-[48px] overflow-visible px-24 flex items-center justify-between opacity-0 will-change-transform"
          style={{
            background: `
    linear-gradient(
      135deg,
      rgb(68,65,241) 0%,
      rgb(65,112,241) 100%
    )
  `,
            boxShadow: `
    0 30px 80px rgba(65,112,241,.25),
    0 0 120px rgba(68,65,241,.18)
  `,
          }}
        >
          {/* LEFT CONTENT */}

          <div
            ref={textRef}
            className="flex flex-col gap-10 max-w-[560px] opacity-0 will-change-transform"
          >
            <h2 className="text-white text-[72px] leading-[1] font-semibold tracking-[-0.04em]">
              Powering engagement
              <br />
              where <em className="italic font-medium">best</em> wins
            </h2>

            <button
              ref={buttonRef}
              className="w-fit rounded-2xl bg-white text-black text-xl font-medium px-8 py-4 opacity-0 transition-colors pointer-events-auto hover:bg-zinc-100 will-change-transform"
            >
              Join Contest Now
            </button>
          </div>

          {/* TROPHY */}

          <div
            ref={trophyRef}
            className="absolute right-10 -top-36 opacity-0 will-change-transform"
          >
            <Image
              src={trophy}
              alt="Trophy"
              priority
              className="w-[520px] h-auto select-none pointer-events-none"
            />
          </div>
        </div>
      </div>
    );
  },
);

FooterCTA.displayName = "FooterCTA";

export default FooterCTA;
