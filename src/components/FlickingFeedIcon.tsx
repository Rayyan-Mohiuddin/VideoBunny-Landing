"use client";

import type { CSSProperties } from "react";
import styles from "./FlickingFeedIcon.module.css";

type FlickingFeedIconProps = {
  width?: number;
  height?: number;
  className?: string;
};

const FRAMES = Array.from({ length: 6 });

export default function FlickingFeedIcon({
  width = 60,
  height = 120,
  className,
}: FlickingFeedIconProps) {
  const gap = Math.max(8, Math.round(height * 0.1));
  const itemHeight = height;

  return (
    <div
      className={className}
      aria-hidden
      style={
        {
          width,
          height,
          overflow: "hidden",
          position: "relative",
          display: "inline-block",
          "--item-h": `${itemHeight}px`,
          "--feed-gap": `${gap}px`,
        } as CSSProperties
      }
    >
      <div className={styles.track}>
        {FRAMES.map((_, index) => (
          <div
            key={index}
            style={{
              width: "100%",
              height: itemHeight,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: Math.max(2, Math.round(height * 0.02)),
            }}
          >
            <span
              style={{
                width: "86%",
                height: "70%",
                borderRadius: Math.max(8, Math.round(width * 0.12)),
                background: "rgba(255,255,255,0.88)",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
