"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import phoneMockup from "@/assets/simple-phone.png";
import { animate, createTimeline } from "animejs";

export default function SimpleSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const [started, setStarted] = useState(false);
  const [typedText, setTypedText] = useState("");

  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const [showFloatingCards, setShowFloatingCards] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      {
        threshold: 0.4,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const text = "It's simple";

    let index = 0;
    let revealTimeline: ReturnType<typeof createTimeline> | null = null;

    const timer = setInterval(() => {
      index++;

      setTypedText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(timer);

        revealTimeline = createTimeline({
          defaults: {
            ease: "outQuart",
          },
        })
          .call(() => {
            setShowSubtitle(true);
          }, 300)
          .call(() => {
            setShowPhone(true);
          }, 900)
          .call(() => {
            setShowFloatingCards(true);
          }, 1700);
      }
    }, 100);

    return () => {
      clearInterval(timer);
      revealTimeline?.revert();
    };
  }, [started]);

  const contestData = [
    {
      title: "Dance battle",
      prize: 12000,
      time: "2h 45m left",
      image: "https://picsum.photos/300/200?random=1",
    },
    {
      title: "Pop sing",
      prize: 8000,
      time: "1h 20m left",
      image: "https://picsum.photos/300/200?random=2",
    },
    {
      title: "Fashion",
      prize: 15000,
      time: "4h 10m left",
      image: "https://picsum.photos/300/200?random=3",
    },
    {
      title: "Comedy",
      prize: 10000,
      time: "55m left",
      image: "https://picsum.photos/300/200?random=4",
    },
  ];

  useEffect(() => {
    if (!showPhone) return;

    animate(".contest-track", {
      translateX: [220, 0],
      opacity: [0, 1],
      duration: 1400,
      ease: "outExpo",
    });
  }, [showPhone]);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "200vh",
        background: "#000",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          flexDirection: isMobile ? "column" : "row",

          padding: isMobile ? "80px 24px" : "0 8vw",

          gap: isMobile ? "60px" : "8vw",

          overflow: "hidden",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            flex: 1,

            color: "#fff",

            position: "relative",

            textAlign: isMobile ? "center" : "left",

            marginBottom: isMobile ? 0 : "400px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: isMobile
                ? "clamp(52px,10vw,72px)"
                : "clamp(72px,6vw,110px)",
              lineHeight: 1,
            }}
          >
            {typedText.startsWith("It's ") ? (
              <>
                It&apos;s{" "}
                <span
                  style={{
                    fontFamily: '"Times New Roman", serif',
                    fontStyle: "italic",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {typedText.slice(5)}
                </span>
              </>
            ) : (
              typedText
            )}
          </h1>

          <div
            style={{
              marginTop: 10,

              color: "#d0d0d0",

              fontSize: isMobile ? "18px" : "24px",

              opacity: showSubtitle ? 1 : 0,

              transform: `translateY(${showSubtitle ? 0 : 24}px)`,

              transition: "opacity 800ms ease, transform 800ms ease",
            }}
          >
            participate in creator or viewer contests
          </div>

          <div
            style={{
              position: "absolute",

              display: isMobile ? "none" : "block",

              top: 260,
              left: 0,

              width: 620,
              height: 260,

              pointerEvents: "none",
            }}
          >
            {/* TOP ROW */}

            <div
              style={{
                display: "flex",
                gap: 24,

                opacity: showFloatingCards ? 1 : 0,

                transform: `
        translateX(
          ${showFloatingCards ? 0 : -120}px
        )
      `,

                transition: "all 1400ms cubic-bezier(.22,1,.36,1)",
              }}
            >
              {contestData.slice(0, 2).map((card, index) => (
                <div
                  key={index}
                  style={{
                    width: isMobile ? 190 : 270,

                    transform: `
        translateY(
          ${index === 1 ? 35 : 0}px
        )
      `,

                    borderRadius: 18,
                    background: "#171717",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: isMobile ? 80 : 100,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      {card.title}
                    </div>

                    <div
                      style={{
                        color: "#FFD54A",

                        marginTop: 10,

                        fontSize: 28,

                        fontWeight: 700,
                      }}
                    >
                      {card.prize.toLocaleString()} 🏆
                    </div>

                    <div
                      style={{
                        color: "#888",
                      }}
                    >
                      Reward pool
                    </div>

                    <div
                      style={{
                        color: "#ff7a00",

                        marginTop: 8,
                      }}
                    >
                      {card.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM FADED ROW */}

            <div
              style={{
                display: "flex",

                gap: 24,

                marginTop: 28,

                opacity: showFloatingCards ? 0.25 : 0,

                transform: `
        translateX(
          ${showFloatingCards ? 0 : -160}px
        )
      `,

                transition: "all 1800ms cubic-bezier(.22,1,.36,1)",

                filter: "blur(8px)",

                maskImage:
                  "linear-gradient(to bottom, rgba(255,255,255,.6), transparent)",

                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(255,255,255,.6), transparent)",
              }}
            >
              {contestData.slice(0, 2).map((card, index) => (
                <div
                  key={index}
                  style={{
                    width: isMobile ? 190 : 270,

                    transform: `
        translateY(
          ${index === 1 ? 35 : 0}px
        )
      `,
                  }}
                >
                  <div
                    style={{
                      height: isMobile ? 80 : 100,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={card.image}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PHONE */}
        <div
          style={{
            position: "relative",

            opacity: showPhone ? 1 : 0,

            transform: `
      translateX(${showPhone ? 0 : 120}px)
      scale(${showPhone ? 1 : 0.95})
    `,

            transition: `
      opacity 1200ms ease,
      transform 1200ms cubic-bezier(.22,1,.36,1)
    `,
          }}
        >
          <Image
            src={phoneMockup}
            alt="Videobunny App"
            priority
            style={{
              width: isMobile ? 220 : 320,
              height: "auto",
              display: "block",
            }}
          />

          {isMobile && (
            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* TOP CARDS */}
              <div
                style={{
                  display: "flex",
                  gap: 14,
                }}
              >
                {contestData.slice(0, 2).map((card, index) => (
                  <div
                    key={index}
                    style={{
                      width: 140,

                      transform: `
              translateY(${index === 1 ? 20 : 0}px)
            `,

                      borderRadius: 16,
                      background: "#171717",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: 70,
                        background: "linear-gradient(135deg,#dff8ff,#87d7ff)",
                      }}
                    />

                    <div
                      style={{
                        padding: 10,
                      }}
                    >
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {card.title}
                      </div>

                      <div
                        style={{
                          color: "#FFD54A",
                          fontSize: 24,
                          fontWeight: 700,
                          marginTop: 6,
                        }}
                      >
                        {card.prize.toLocaleString()} 🏆
                      </div>

                      <div
                        style={{
                          color: "#888",
                        }}
                      >
                        Reward pool
                      </div>

                      <div
                        style={{
                          color: "#ff7a00",
                          marginTop: 6,
                        }}
                      >
                        {card.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* REFLECTIONS */}
              <div
                style={{
                  display: "flex",
                  gap: 14,

                  opacity: 0.18,

                  filter: "blur(8px)",

                  marginTop: -6,

                  maskImage:
                    "linear-gradient(to bottom, rgba(255,255,255,.6), transparent)",

                  WebkitMaskImage:
                    "linear-gradient(to bottom, rgba(255,255,255,.6), transparent)",
                }}
              >
                {[1, 2].map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: 140,

                      transform: `
              translateY(${index === 1 ? 20 : 0}px)
            `,
                    }}
                  >
                    <div
                      style={{
                        height: 70,
                        background: "linear-gradient(135deg,#dff8ff,#87d7ff)",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTEST CARDS INSIDE PHONE */}
          <div
            style={{
              position: "absolute",

              top: isMobile ? "36%" : "59%",
              left: isMobile ? "5%" : "8%",

              width: isMobile ? 195 : 285,
              height: isMobile ? 120 : 180,

              overflow: "hidden",

              zIndex: 5,
            }}
          >
            <div
              className="contest-track"
              style={{
                display: "flex",
                gap: 12,

                opacity: 0,
              }}
            >
              {contestData.map((card, index) => (
                <div
                  key={index}
                  style={{
                    width: isMobile ? 90 : 120,

                    borderRadius: 14,

                    background: "#171717",

                    overflow: "hidden",

                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      height: isMobile ? 42 : 70,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      padding: 10,
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",

                        fontSize: isMobile ? 8 : 12,

                        fontWeight: 600,
                      }}
                    >
                      {card.title}
                    </div>

                    <div
                      style={{
                        color: "#FFD54A",

                        marginTop: 6,

                        fontSize: isMobile ? 12 : 18,

                        fontWeight: 700,
                      }}
                    >
                      {card.prize.toLocaleString()} 🏆
                    </div>

                    <div
                      style={{
                        color: "#888",

                        fontSize: isMobile ? 8 : 11,
                      }}
                    >
                      Reward pool
                    </div>

                    <div
                      style={{
                        color: "#ff7a00",

                        marginTop: 4,

                        fontSize: isMobile ? 8 : 11,
                      }}
                    >
                      {card.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
