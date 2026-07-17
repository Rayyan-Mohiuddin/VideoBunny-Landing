"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import leaderboardPhone from "@/assets/leaderboard-phone.png";

import FloatingEmoji from "./FloatingEmoji";
import WinnerBubble from "./WinnerBubble";
import LeaderboardRow from "./LeaderboardRow";
import { emojiConfig } from "./emojiConfig";
import { getLeaderboardData } from "./dummyLeaderboardData";
import type { LeaderboardUser } from "./types";
import CreatorPreview from "./CreatorPreview";
import {
  useLeaderboardAnimations,
  type LeaderboardRefs,
} from "./useLeaderboardAnimations";

const LERP_FACTOR = 0.08;

export default function LeaderboardSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const winnersTitleRef = useRef<HTMLDivElement>(null);
  const rankingsTitleRef = useRef<HTMLDivElement>(null);

  const emojiRefs = useRef<(HTMLDivElement | null)[]>([]);
  const winnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rawProgressRef = useRef(0);
  const smoothedProgressRef = useRef(0);

  const [isMobile, setIsMobile] = useState(false);

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedCreator, setSelectedCreator] =
    useState<LeaderboardUser | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
    };

    update();

    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await getLeaderboardData();
        setLeaderboardData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  const refs: LeaderboardRefs = {
    headingRef,
    phoneRef,
    gradientRef,
    emojiRefs,
    winnersTitleRef,
    winnerRefs,
    rankingsTitleRef,
    rowRefs,
  };

  const topCreators = leaderboardData.slice(0, 3);

  const rankedRows = leaderboardData;

  useLeaderboardAnimations(smoothedProgressRef, refs, topCreators, rankedRows);

  useEffect(() => {
    let frame: number;

    const computeRawProgress = () => {
      const el = sectionRef.current;
      if (!el) return 0;

      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return 0;

      const scrolled = -rect.top;
      return Math.min(1, Math.max(0, scrolled / total));
    };

    const tick = () => {
      rawProgressRef.current = computeRawProgress();
      smoothedProgressRef.current +=
        (rawProgressRef.current - smoothedProgressRef.current) * LERP_FACTOR;

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "320vh",
        background: "#050505",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#050505",
        }}
      >
        <div
          className="leaderboard-composition"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "min(94vw, 520px)",
            height: "min(82vh, 650px)",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Heading */}
          <div
            ref={headingRef}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: 0,
              zIndex: 30,
              willChange: "transform, opacity",
            }}
          >
            <h2
              style={{
                color: "#fff",
                fontSize: "clamp(28px,6vw,25px)",
                fontWeight: 400,
                lineHeight: 1.16,
                letterSpacing: "0",
                margin: 0,
              }}
            >
              Leaderboard makes you
              <br />
              visible to the <em style={{ fontStyle: "italic" }}>audience</em>
            </h2>
          </div>

          {/* Emoji layer shares the same composition canvas as the phone. */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "60%",
              width: 1,
              height: 1,
              transform: isMobile
                ? "translate(-50%, -50%) scale(.72)"
                : "translate(-50%, -50%) scale(.9)",
              transformOrigin: "center",
              pointerEvents: "none",
              zIndex: 25,
            }}
          >
            {emojiConfig.map((cfg, i) => (
              <FloatingEmoji
                key={cfg.id}
                ref={(el) => {
                  emojiRefs.current[i] = el;
                }}
                image={cfg.image}
                size={isMobile ? cfg.width * 0.82 : cfg.width}
                x={
                  !isMobile
                    ? cfg.x
                    : cfg.id === "crown"
                      ? cfg.x * 0.68
                      : cfg.x * 0.62
                }
                y={
                  !isMobile
                    ? cfg.y
                    : cfg.id === "crown"
                      ? cfg.y * 0.58
                      : cfg.y * 0.62
                }
              />
            ))}
          </div>

          {/* Phone slot */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: isMobile ? "20%" : "20%",
              display: "flex",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            <div
              ref={phoneRef}
              style={{
                position: "relative",
                width: isMobile ? "clamp(100px, 80vw, 220px)" : "270px",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            >
              <Image
                src={leaderboardPhone}
                alt=""
                draggable={false}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  userSelect: "none",
                }}
              />

              {/* Screen content, rendered on top of the empty phone bezel */}
              <div
                style={{
                  position: "absolute",

                  top: "5%",

                  left: "6.4%",

                  right: "6.4%",

                  bottom: "5%",
                  // borderRadius: "clamp(20px, 2vw, 26px)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  // background: "#101014",
                }}
              >
                {/* Blue gradient header */}
                <div
                  ref={gradientRef}
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 0,
                    right: 0,
                    height: "36%",
                    zIndex: 1,
                    background:
                      "linear-gradient(180deg, #3457FF 0%, #4B2FCB 55%, #0E1230 100%)",
                  }}
                />

                <div
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    padding: "clamp(7px, 1vw, 10px) clamp(10px, 1vw, 14px)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Winners title */}
                  <div
                    ref={winnersTitleRef}
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      opacity: 0,
                      marginBottom: 7,
                      willChange: "transform, opacity",
                      position: "absolute",
                      top: "4%",
                      left: isMobile ? 72.5 : 93,
                      right: 10,
                      zIndex: 15,
                    }}
                  >
                    Winners
                  </div>

                  {/* Top 3 podium */}
                  <div
                    style={{
                      position: "absolute",
                      top: "13%",
                      left: 0,
                      right: 0,
                      display: "flex",
                      justifyContent: "space-around",
                      zIndex: 2,
                    }}
                  >
                    {topCreators.map((user, i) => (
                      <div
                        key={user.id}
                        ref={(el) => {
                          winnerRefs.current[i] = el;
                        }}
                      >
                        <WinnerBubble
                          avatar={user.avatar}
                          username={user.username}
                          score={user.score}
                          rank={user.rank}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Rankings divider */}
                  <div
                    ref={rankingsTitleRef}
                    style={{
                      position: "absolute",
                      top: "45%",
                      left: 12,
                      right: 12,

                      opacity: 0,

                      zIndex: 20,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 5,
                      }}
                    >
                      <span
                        style={{
                          color: "#A7A7A7",
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Rankings
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 1,
                          background: "rgba(255,255,255,.12)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Ranked rows */}
                  <div
                    style={{
                      position: "absolute",

                      top: "50%",

                      left: 14,
                      right: 14,

                      display: "flex",
                      flexDirection: "column",

                      gap: 6,

                      zIndex: 30,
                    }}
                  >
                    {rankedRows.map((user, i) => (
                      <div
                        key={user.id}
                        ref={(el) => {
                          rowRefs.current[i] = el;
                        }}
                      >
                        <LeaderboardRow
                          creator={user}
                          onClick={(creator) => {
                            setSelectedCreator(creator);
                            setPreviewOpen(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <CreatorPreview
                    creator={selectedCreator}
                    open={previewOpen}
                    onClose={() => {
                      setPreviewOpen(false);
                    }}
                    onWatchVideo={() => {
                      console.log(selectedCreator?.video);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .leaderboard-composition .winner-bubble,
          .leaderboard-composition .leaderboard-row {
            opacity: 1 !important;
          }

          .leaderboard-composition .winner-bubble {
            transform: none !important;
          }

          .leaderboard-composition .winner-bubble > div:first-child {
            width: 36px !important;
            height: 36px !important;
            border-width: 2px !important;
          }

          .leaderboard-composition .winner-bubble > div:nth-child(2) {
            margin-top: 4px !important;
            font-size: 8px !important;
          }

          .leaderboard-composition .winner-score {
            margin-top: 2px !important;
            font-size: 10px !important;
          }
        `}</style>
      </div>
    </section>
  );
}
