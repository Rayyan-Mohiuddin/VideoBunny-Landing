"use client";

import Image from "next/image";

export interface WinnerBubbleProps {
  avatar: string;
  username: string;
  score: number;
  rank: number;
}

export default function WinnerBubble({
  avatar,
  username,
  score,
  rank,
}: WinnerBubbleProps) {
  return (
    <div
      className="winner-bubble"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        opacity: 0,

        transform: "translateY(20px) scale(0.8)",

        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          width: rank === 1 ? 68 : 58,
          height: rank === 1 ? 68 : 58,

          borderRadius: "50%",

          overflow: "hidden",

          border: "3px solid rgba(255,255,255,.18)",

          background: "#222",

          boxShadow: "0 12px 40px rgba(0,0,0,.35)",
        }}
      >
        <Image
          src={avatar}
          alt={username}
          width={80}
          height={80}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {username}
      </div>

      <div
        className="winner-score"
        data-score={score}
        style={{
          marginTop: 4,
          color: "#FFD54A",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        0
      </div>
    </div>
  );
}
