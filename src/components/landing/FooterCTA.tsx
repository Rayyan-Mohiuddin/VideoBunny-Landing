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
          className="
            relative

            w-[90vw] max-w-[340px] h-[470px] rounded-[28px] pt-24 pb-8 px-6
            md:w-[85vw] md:max-w-[820px] md:h-[480px] md:rounded-[40px] md:pt-0 md:pb-0 md:px-14
            lg:w-[82vw] lg:max-w-[1200px] lg:h-[560px] lg:rounded-[48px] lg:px-24

            overflow-visible

            flex flex-col items-center justify-center text-center
            md:flex-row md:justify-between md:text-left

            opacity-0
            will-change-transform
          "
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
            className="
              flex
              flex-col
              items-center
              gap-6
              max-w-full

              md:items-stretch
              md:gap-8
              md:max-w-[420px]

              lg:gap-10
              lg:max-w-[560px]

              opacity-0
              will-change-transform
            "
          >
            <h2
              className="
                text-white
                leading-[1]
                font-semibold
                tracking-[-0.04em]

                text-[clamp(2.2rem,8vw,4rem)]
                md:text-[clamp(3rem,6vw,4.5rem)]
                lg:text-[72px]
              "
            >
              Powering engagement
              <br />
              where <em className="italic font-medium">best</em> wins
            </h2>

            <button
              ref={buttonRef}
              className="
                rounded-2xl
                bg-white
                text-black
                font-medium
                opacity-0
                transition-colors
                pointer-events-auto
                hover:bg-zinc-100
                will-change-transform

                w-full max-w-[270px] text-base px-6 py-3

                md:w-fit md:text-xl md:px-8 md:py-4
              "
            >
              Join Contest Now
            </button>
          </div>

          {/* TROPHY */}

          <div
            ref={trophyRef}
            className="
              absolute

              left-1/2 -ml-[125px] -top-[72px]
              md:left-auto md:ml-0 md:right-10 md:-top-36

              opacity-0
              will-change-transform
            "
          >
            <Image
              src={trophy}
              alt="Trophy"
              priority
              className="
                w-[250px]
                md:w-[380px]
                lg:w-[520px]
                h-auto
                select-none
                pointer-events-none
              "
            />
          </div>
        </div>
      </div>
    );
  },
);

FooterCTA.displayName = "FooterCTA";

export default FooterCTA;
