"use client";

import { useRef } from "react";
import Image from "next/image";

import ReflectionImage from "./ReflectionImage";
import { PHONE_FRAME, PING_IMAGES } from "./assets";
import { SECTION_HEIGHT } from "./constants";
import styles from "./PingsPreviewSection.module.css";

import usePingsPreviewAnimations from "@/hooks/usePingsPreviewAnimations";

export default function PingsPreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLDivElement>(null);

  const phoneWrapperRef = useRef<HTMLDivElement>(null);

  // Phone screen
  const screenRef = useRef<HTMLDivElement>(null);
  const screenImageRef = useRef<HTMLImageElement>(null);

  // Reflection wrappers
  const previousReflectionRef = useRef<HTMLDivElement>(null);
  const nextReflectionRef = useRef<HTMLDivElement>(null);

  // Reflection images
  const previousReflectionImageRef = useRef<HTMLImageElement>(null);
  const nextReflectionImageRef = useRef<HTMLImageElement>(null);

  usePingsPreviewAnimations({
    sectionRef,
    stickyRef,

    titleRef,

    phoneWrapperRef,

    screenRef,
    screenImageRef,

    previousReflectionRef,
    previousReflectionImageRef,

    nextReflectionRef,
    nextReflectionImageRef,
  });

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: SECTION_HEIGHT,
        background: "#000",
      }}
    >
      <div
        ref={stickyRef}
        className={styles.sticky}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",

          display: "flex",
          alignItems: "center",

          padding: "0 clamp(32px,5vw,96px)",

          touchAction: "none",
        }}
      >
        {/* LEFT */}

        <div
          ref={titleRef}
          className={styles.title}
          style={{
            opacity: 0,
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(36px,4vw,50px)",
              lineHeight: 1.1,
              fontWeight: 500,
              letterSpacing: "-0.04em",
            }}
          >
            Interacting with content
            <br />
            goes to <em>next level</em>
          </h2>
        </div>

        {/* RIGHT */}

        <div
          ref={phoneWrapperRef}
          className={styles.phoneWrapper}
          style={{
            position: "relative",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            opacity: 0,
          }}
        >
          {/* Previous Reflection */}

          <div
            ref={previousReflectionRef}
            style={{
              position: "absolute",
              top: "calc(-1 * clamp(154px, 42vw, 220px))",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          >
            <ReflectionImage
              position="top"
              imageRef={previousReflectionImageRef}
              initialSrc={PING_IMAGES[0].src}
            />
          </div>

          {/* Phone */}

          <div
            style={{
              position: "relative",
              width: "clamp(220px, 60vw, 314px)",
              aspectRatio: "314 / 500",
              zIndex: 10,
            }}
          >
            {/* Screen */}

            <div
              ref={screenRef}
              style={{
                position: "absolute",

                left: "20%",
                top: "10%",

                width: "55%",
                height: "83%",

                overflow: "hidden",

                borderRadius: 30,

                zIndex: 2,

                transform: `
                  perspective(1800px)
                  rotateY(-32deg)
                `,
              }}
            >
              <img
                ref={screenImageRef}
                src={PING_IMAGES[1].src}
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

            {/* Phone Frame */}

            <Image
              src={PHONE_FRAME}
              alt=""
              fill
              priority
              draggable={false}
              sizes="(min-width: 1024px) 314px, 60vw"
              style={{
                objectFit: "contain",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 1,
              }}
            />
          </div>

          {/* Next Reflection */}

          <div
            ref={nextReflectionRef}
            style={{
              position: "absolute",
              bottom: "calc(-1 * clamp(154px, 42vw, 220px))",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          >
            <ReflectionImage
              position="bottom"
              imageRef={nextReflectionImageRef}
              initialSrc={PING_IMAGES[2].src}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
