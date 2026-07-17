"use client";

import React, { forwardRef } from "react";

interface ReflectionThumbnailProps {
  src: string;

  className?: string;

  opacity?: number;
  scale?: number;
  rotate?: number;
  blur?: number;

  mask?: "top" | "bottom" | "none";
}

const ReflectionThumbnail = forwardRef<
  HTMLDivElement,
  ReflectionThumbnailProps
>(
  (
    {
      src,
      className = "",
      opacity = 1,
      scale = 1,
      rotate = 0,
      blur = 0,
      mask = "none",
    },
    ref,
  ) => {
    const maskImage =
      mask === "top"
        ? "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.15) 20%, black 70%, black 100%)"
        : mask === "bottom"
          ? "linear-gradient(to top, transparent 0%, rgba(0,0,0,.15) 20%, black 70%, black 100%)"
          : "none";

    return (
      <div
        ref={ref}
        className={className}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          overflow: "hidden",

          opacity,
          filter: `blur(${blur}px)`,
          transform: `scale(${scale}) rotate(${rotate}deg)`,

          WebkitMaskImage: maskImage,
          maskImage,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",

          backgroundColor: "#000",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          willChange: "transform, opacity, filter",
        }}
      >
        <img
          src={src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",

            filter: "saturate(0.82) contrast(0.94) brightness(0.98)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.12) 100%)",
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  },
);

ReflectionThumbnail.displayName = "ReflectionThumbnail";

export default ReflectionThumbnail;
