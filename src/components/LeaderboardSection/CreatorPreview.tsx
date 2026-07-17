"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { LeaderboardUser } from "./types";

interface CreatorPreviewProps {
  creator: LeaderboardUser | null;
  open: boolean;
  onClose: () => void;
  onWatchVideo?: () => void;
}

export default function CreatorPreview({
  creator,
  open,
  onClose,
  onWatchVideo,
}: CreatorPreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(open);
    });
  }, [open]);

  if (!creator) return null;

  return (
    <div
      style={{
        position: "absolute",

        inset: 0,

        zIndex: 500,

        pointerEvents: open ? "auto" : "none",

        overflow: "hidden",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,

          background: "rgba(0,0,0,.25)",

          opacity: mounted ? 1 : 0,

          transition: "opacity .35s ease",
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "absolute",

          left: 0,
          right: 0,
          bottom: 0,

          height: "98%",

          background: "#111114",

          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,

          transform: mounted ? "translateY(0)" : "translateY(100%)",

          transition: "transform .55s cubic-bezier(.22,1,.36,1)",

          display: "flex",
          flexDirection: "column",

          padding: 18,

          boxSizing: "border-box",
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: 42,
            height: 5,

            background: "#3b3b3b",

            borderRadius: 999,

            alignSelf: "center",

            marginBottom: 18,
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",

            alignItems: "center",

            justifyContent: "space-between",

            marginBottom: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",

              border: "none",

              color: "#fff",

              fontSize: 11,

              cursor: "pointer",

              padding: 0,
            }}
          >
            ← Back
          </button>
        </div>

        {/* Creator */}
        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 14,

            marginBottom: 10,
          }}
        >
          <Image
            src={creator.avatar}
            alt={creator.username}
            width={20}
            height={20}
            style={{
              borderRadius: "50%",
            }}
          />

          <div>
            <div
              style={{
                color: "#fff",

                fontSize: 10,

                fontWeight: 700,
              }}
            >
              @{creator.username}
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        <div
          style={{
            position: "relative",

            width: "100%",

            flex: 1,

            borderRadius: 22,

            overflow: "hidden",

            background: "#1d1d1d",
          }}
        >
          <Image
            src={creator.video.image}
            alt={creator.username}
            fill
            draggable={false}
            style={{
              objectFit: "cover",
            }}
          />

          <div
            style={{
              position: "absolute",

              inset: 0,

              background:
                "linear-gradient(to top, rgba(0,0,0,.65), transparent 45%)",
            }}
          />
        </div>

        {/* Button */}
        <button
          onClick={onWatchVideo}
          style={{
            marginTop: 15,

            height: 30,

            marginBottom: -5,

            border: "solid",

            borderWidth: 1,

            borderRadius: 8,

            background: "#111114",

            color: "#fff",

            fontSize: 14,

            fontWeight: 400,

            cursor: "pointer",
          }}
        >
          ▶ Watch Video
        </button>
      </div>
    </div>
  );
}
