"use client";

import React, { forwardRef } from "react";

interface FloatingAvatarProps {
  src: string;
  alt?: string;

  size?: number;

  x: number;
  y: number;

  opacity?: number;
  scale?: number;

  className?: string;
}

const FloatingAvatar = forwardRef<HTMLDivElement, FloatingAvatarProps>(
  (
    {
      src,
      alt = "Creator",

      size = 64,

      x,
      y,

      opacity = 1,
      scale = 1,

      className = "",
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          position: "absolute",

          left: x,
          top: y,

          width: size,
          height: size,

          borderRadius: "50%",

          overflow: "hidden",

          border: "3px solid rgba(255,255,255,0.95)",

          background: "#111",

          boxShadow:
            "0 12px 35px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)",

          transform: `translate(-50%, -50%) scale(${scale})`,

          opacity,

          willChange: "transform, opacity",

          pointerEvents: "none",

          userSelect: "none",

          zIndex: 20,
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  },
);

FloatingAvatar.displayName = "FloatingAvatar";

export default FloatingAvatar;
