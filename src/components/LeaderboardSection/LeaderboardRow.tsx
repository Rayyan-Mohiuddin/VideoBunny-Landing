"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { LeaderboardUser } from "./types";

export interface LeaderboardRowProps {
  creator: LeaderboardUser;
  onClick?: (creator: LeaderboardUser) => void;
}

export default function LeaderboardRow({
  creator,
  onClick,
}: LeaderboardRowProps) {
  const { rank, avatar, username, score } = creator;
  const isTopThree = rank <= 3;

  const suffix =
    rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th";

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
    };

    update();

    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className="leaderboard-row"
      role="button"
      tabIndex={0}
      onClick={() => {
        onClick?.(creator);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(creator);
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#111111";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#2B2B2B";
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        width: isMobile
          ? "clamp(150px, 84vw, 187px)"
          : "clamp(150px, 84vw, 230px)",

        padding: "8px 10px",
        marginBottom: 6,
        marginLeft: isMobile ? 17 : 19,

        borderRadius: 12,

        background: "#2B2B2B",

        cursor: "pointer",

        opacity: 0,
        transform: "translateX(-30px)",

        transition: "background-color .2s ease",

        willChange: "transform, opacity, background-color",
      }}
    >
      {/* Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,

          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 24,

            color: isTopThree ? "#FFD54A" : "#FFFFFF",

            fontSize: 12,
            fontWeight: 700,

            flexShrink: 0,
          }}
        >
          {rank}
          {suffix}
        </div>

        <div
          style={{
            width: 28,
            height: 28,

            borderRadius: "50%",
            overflow: "hidden",

            background: "#1A1A1A",

            flexShrink: 0,
          }}
        >
          <Image
            src={avatar}
            alt={username}
            width={28}
            height={28}
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
            flex: 1,
            minWidth: 0,

            color: "#F5F5F5",

            fontSize: 13,
            fontWeight: 600,

            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {username}
        </div>
      </div>

      {/* Right */}
      <div
        className="leaderboard-score"
        data-score={score}
        style={{
          marginLeft: 8,

          color: "#FFFFFF",

          fontSize: 14,
          fontWeight: 700,

          flexShrink: 0,
        }}
      >
        0 pts
      </div>
    </div>
  );
}
