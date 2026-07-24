"use client";

import { forwardRef } from "react";

interface ReflectionImageProps {
  position: "top" | "bottom";
  hidden?: boolean;
  imageRef: React.RefObject<HTMLImageElement | null>;
  initialSrc: string;
}

const ReflectionImage = forwardRef<HTMLDivElement, ReflectionImageProps>(
  ({ position, hidden = false, imageRef, initialSrc }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: "relative",

          width: "clamp(160px, 50vw, 260px)",
          aspectRatio: "260 / 300",

          overflow: "hidden",

          borderRadius: 28,

          opacity: hidden ? 0 : 0.5,

          filter: hidden ? "blur(4px)" : "blur(3px)",

          maskImage:
            position === "top"
              ? "linear-gradient(to bottom, transparent, black 45%)"
              : "linear-gradient(to top, transparent, black 45%)",

          WebkitMaskImage:
            position === "top"
              ? "linear-gradient(to bottom, transparent, black 45%)"
              : "linear-gradient(to top, transparent, black 45%)",

          willChange: "transform, opacity",

          transform: `
                  perspective(1800px)
                  rotateY(-32deg)
                `,
        }}
      >
        <img
          ref={imageRef}
          src={initialSrc}
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",

            display: "block",

            userSelect: "none",

            pointerEvents: "none",
          }}
        />
      </div>
    );
  },
);

ReflectionImage.displayName = "ReflectionImage";

export default ReflectionImage;
