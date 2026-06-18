"use client";

import Image from "next/image";
import ribbon from "@/assets/ribbon.png";

import { useEffect, useRef } from "react";

export default function Ribbon({
  opacity,
  velocity,
}: {
  opacity: number;
  velocity: number;
}) {
  const energyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;

    let offset = 0;
    let speed = 0.2;

    const animate = () => {
      const targetSpeed = 0.2 + Math.min(velocity, 8) * 0.8;

      speed += (targetSpeed - speed) * 0.08;

      offset += speed;

      if (energyRef.current) {
        energyRef.current.style.backgroundPosition = `${offset}px center`;

        energyRef.current.style.opacity = `${
          0.45 + Math.min(velocity, 8) * 0.04
        }`;

        energyRef.current.style.filter = `
          blur(${20 - Math.min(velocity, 8)}px)
          saturate(${1.1 + velocity * 0.1})
          brightness(${1 + velocity * 0.05})
        `;
      }

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, [velocity]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,

        opacity,

        pointerEvents: "none",

        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",

        paddingBottom: "12vh",
      }}
    >
      <div
        style={{
          position: "relative",

          width: "95vw",

          maxWidth: "2200px",
        }}
      >
        {/* Base Ribbon */}
        <Image
          src={ribbon}
          alt="Ribbon"
          priority
          style={{
            width: "100%",
            height: "auto",

            position: "relative",
            zIndex: 2,
          }}
        />

        {/* Flowing Energy */}
        <div
          ref={energyRef}
          style={{
            position: "absolute",
            inset: 0,

            background: `
              linear-gradient(
                90deg,
                #2f6bff 0%,
                #8a4fff 20%,
                #ff8a00 40%,
                #ff5ec9 60%,
                #7d4dff 80%,
                #2f6bff 100%
              )
            `,

            backgroundSize: "250% 100%",

            mixBlendMode: "screen",

            opacity: 0.45,

            zIndex: 3,

            WebkitMaskImage: `url(${ribbon.src})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",

            maskImage: `url(${ribbon.src})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      </div>
    </div>
  );
}
