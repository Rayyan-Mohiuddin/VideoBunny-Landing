"use client";

import Image from "next/image";

import { arrow, videobunnyLogo } from "./assets";

interface FooterJoinButtonProps {
  sceneRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  arrowRef: React.RefObject<HTMLDivElement | null>;
}

export default function FooterJoinButton({
  sceneRef,
  buttonRef,
  arrowRef,
}: FooterJoinButtonProps) {
  return (
    <div
      ref={sceneRef}
      className="absolute inset-0 opacity-0 overflow-hidden will-change-transform"
    >
      {/* Background */}
      {/*removed the circular gradient*/}

      {/* Watermark */}

      <h1 className="absolute left-1/2 top-[88%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(90px,10vw,220px)] font-bold tracking-[-0.06em] text-[#1B246E] opacity-[0.28] select-none pointer-events-none">
        Videobunny
      </h1>

      {/* Logo */}

      <button
        ref={buttonRef}
        className="absolute left-1/2 top-[74%] -translate-x-1/2 -translate-y-1/2 h-36 w-36"
      >
        <Image
          src={videobunnyLogo}
          alt="Videobunny"
          className="w-full h-full"
        />
      </button>

      {/* Join Now */}

      <div
        ref={arrowRef}
        className="absolute left-[53%] top-[57.5%] -translate-x-[-10px] flex items-start gap-2 opacity-0 will-change-transform"
      >
        <span className="absolute -top-4 left-17 text-white text-lg font-medium whitespace-nowrap">
          Join now
        </span>

        <Image
          src={arrow}
          alt=""
          className="-ml-3 w-20 h-auto select-none pointer-events-none"
        />
      </div>
    </div>
  );
}
