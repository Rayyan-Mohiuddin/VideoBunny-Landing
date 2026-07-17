"use client";

import Image, { StaticImageData } from "next/image";
import { forwardRef } from "react";

export interface FloatingEmojiProps {
  image: StaticImageData;
  size: number;
  x: number;
  y: number;
}

const FloatingEmoji = forwardRef<HTMLDivElement, FloatingEmojiProps>(
  ({ image, size, x, y }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: "absolute",

          left: "50%",
          top: "50%",

          width: size,
          height: size,

          opacity: 0,

          transform: `
            translate(-50%, -50%)
            translate(${x}px, ${y}px)
            scale(0)
          `,

          pointerEvents: "none",

          willChange: "transform, opacity",

          zIndex: 20,
        }}
      >
        <Image
          src={image}
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            userSelect: "none",
          }}
        />
      </div>
    );
  },
);

FloatingEmoji.displayName = "FloatingEmoji";

export default FloatingEmoji;
