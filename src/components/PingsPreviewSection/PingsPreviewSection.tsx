"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import pingsPreviewImage from "@/assets/pings-preview.png";

import ReflectionThumbnail from "./ReflectionVideo";
import FloatingAvatar from "./FloatingAvatar";

import { usePingsPreviewAnimations } from "@/hooks/usePingsPreviewAnimations";

import type {
  PreviewUser,
  PreviewVideo,
  PingsPreviewResponse,
} from "@/types/pings-preview";

const DESKTOP_AVATAR_POSITIONS = [
  { x: 15, y: 24, size: 62 },
  { x: 83, y: 22, size: 58 },
  { x: 10, y: 56, size: 68 },
  { x: 88, y: 58, size: 60 },
  { x: 22, y: 82, size: 64 },
];

export default function PingsPreviewSection() {
  const [users, setUsers] = useState<PreviewUser[]>([]);
  const [videos, setVideos] = useState<PreviewVideo[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchPreview() {
      try {
        const response = await fetch("/api/pings-preview", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch preview data.");
        }

        const data: PingsPreviewResponse = await response.json();

        if (!mounted) return;

        setUsers(data.users);
        setVideos(data.videos);
      } catch (err) {
        console.error(err);

        if (!mounted) return;

        setError("Unable to load preview.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchPreview();

    return () => {
      mounted = false;
    };
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const topVideo = videos[currentIndex];
  const mainVideo = videos[currentIndex + 1];
  const bottomVideo = videos[currentIndex + 2];

  const avatars = useMemo(() => {
    return users.slice(0, 5);
  }, [users]);

  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const phoneWrapperRef = useRef<HTMLDivElement>(null);

  const mainVideoRef = useRef<HTMLDivElement>(null);
  const topReflectionRef = useRef<HTMLDivElement>(null);
  const bottomReflectionRef = useRef<HTMLDivElement>(null);

  const topReflectionWrapperRef = useRef<HTMLDivElement>(null);
  const mainVideoWrapperRef = useRef<HTMLDivElement>(null);
  const bottomReflectionWrapperRef = useRef<HTMLDivElement>(null);

  const avatarRefs = useRef<(HTMLDivElement | null)[]>([]);

  usePingsPreviewAnimations({
    videos,
    currentIndex,
    setCurrentIndex,

    sectionRef,
    stickyRef,
    headingRef,
    phoneWrapperRef,

    topReflectionWrapperRef,
    mainVideoWrapperRef,
    bottomReflectionWrapperRef,

    topReflectionRef,
    mainVideoRef,
    bottomReflectionRef,

    avatarRefs,

    topReflectionRotationDeg: 2.03,
    mainVideoRotationDeg: -5.96,
    bottomReflectionRotationDeg: -2.03,
  });

  if (loading) {
    return (
      <section
        style={{
          background: "#000",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        Loading...
      </section>
    );
  }

  if (error || !mainVideo) {
    return (
      <section
        style={{
          background: "#000",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        {error || "Preview unavailable."}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "180vh",
        background: "#000",
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "50px", // was 90px
        }}
      >
        <div
          ref={headingRef}
          style={{
            textAlign: "center",
            color: "#fff",
            marginBottom: isMobile ? "48px" : "72px",
            zIndex: 20,
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "0.75rem" : "2rem",
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Interacting with content
            <br />
            goes to <em>next level</em>
          </h2>
        </div>

        {!isMobile &&
          avatars.map((avatar, index) => {
            const pos = DESKTOP_AVATAR_POSITIONS[index];

            if (!pos) return null;

            return (
              <FloatingAvatar
                key={avatar.id}
                ref={(el) => {
                  avatarRefs.current[index] = el;
                }}
                src={avatar.avatar}
                alt={avatar.fullName}
                size={pos.size}
                x={pos.x}
                y={pos.y}
              />
            );
          })}

        <div
          ref={phoneWrapperRef}
          style={{
            position: "relative",
            width: isMobile ? 280 : 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: -30,
          }}
        >
          {topVideo && (
            <div
              ref={topReflectionWrapperRef}
              style={{
                position: "absolute",
                left: "39.77%",
                top: "1.06%",
                width: "19.22%",
                height: "16.62%",
                transform: "rotate(2.03deg)",
                transformOrigin: "center center",
                zIndex: 1,
              }}
            >
              <ReflectionThumbnail
                ref={topReflectionRef}
                src={topVideo.image}
                mask="top"
                opacity={0.25}
                scale={0.95}
                rotate={-2}
                blur={4}
              />
            </div>
          )}

          {bottomVideo && (
            <div
              ref={bottomReflectionWrapperRef}
              style={{
                position: "absolute",
                left: "39.77%",
                top: "81.19%",
                width: "19.22%",
                height: "16.62%",
                transform: "rotate(-2.03deg)",
                transformOrigin: "center center",
                zIndex: 1,
              }}
            >
              <ReflectionThumbnail
                ref={bottomReflectionRef}
                src={bottomVideo.image}
                mask="bottom"
                opacity={1}
                scale={0.95}
                rotate={-2}
                blur={4}
              />
            </div>
          )}

          <Image
            src={pingsPreviewImage}
            alt="Pings Preview"
            priority
            draggable={false}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              position: "relative",
              zIndex: 5,
              userSelect: "none",
              pointerEvents: "none",
            }}
          />

          <div
            ref={mainVideoWrapperRef}
            style={{
              position: "absolute",
              left: "44.58%",
              top: "22%",
              width: "17.24%",
              height: "54.87%",
              overflow: "hidden",
              borderRadius: "16px",
              zIndex: 5,
              background: "#000",
              transform: "rotate(-5.96deg)",
              // sells the recess: dark falloff toward bottom-right (away from the
              // mockup's top-left light), faint rim light top-left, hairline edge
              boxShadow:
                "inset 6px 6px 14px rgba(0,0,0,0.35), inset -2px -2px 6px rgba(255,255,255,0.12)",
              border: "1px solid rgba(0,0,0,0.35)",
            }}
          >
            <ReflectionThumbnail
              ref={mainVideoRef}
              src={mainVideo.image}
              mask="none"
              opacity={1}
              scale={1}
              rotate={0}
              blur={0}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
