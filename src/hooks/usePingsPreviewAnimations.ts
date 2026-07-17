"use client";

import { RefObject, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { animate, cleanInlineStyles, createTimeline } from "animejs";

import type { PreviewVideo } from "@/types/pings-preview";

interface UsePingsPreviewAnimationsProps {
  videos: PreviewVideo[];

  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;

  sectionRef: RefObject<HTMLElement | null>;
  stickyRef: RefObject<HTMLDivElement | null>;
  headingRef: RefObject<HTMLDivElement | null>;
  phoneWrapperRef: RefObject<HTMLDivElement | null>;

  topReflectionWrapperRef: RefObject<HTMLDivElement | null>;
  mainVideoWrapperRef: RefObject<HTMLDivElement | null>;
  bottomReflectionWrapperRef: RefObject<HTMLDivElement | null>;

  topReflectionRef: RefObject<HTMLDivElement | null>;
  mainVideoRef: RefObject<HTMLDivElement | null>;
  bottomReflectionRef: RefObject<HTMLDivElement | null>;

  avatarRefs: RefObject<(HTMLDivElement | null)[]>;

  topReflectionRotationDeg?: number;
  mainVideoRotationDeg?: number;
  bottomReflectionRotationDeg?: number;
}

const PROMOTION_DURATION = 900;
const PROMOTION_EASE = "inOutCubic";
const EXIT_SCALE = 0.92;

type Rect = { left: number; top: number; width: number; height: number };

type SlotTransform = {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
};

function slotTransform(from: Rect, to: Rect): SlotTransform {
  return {
    translateX: to.left + to.width / 2 - (from.left + from.width / 2),
    translateY: to.top + to.height / 2 - (from.top + from.height / 2),
    scaleX: to.width / from.width,
    scaleY: to.height / from.height,
  };
}

export function usePingsPreviewAnimations({
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

  topReflectionRotationDeg = 2.03,
  mainVideoRotationDeg = -5.96,
  bottomReflectionRotationDeg = -2.03,
}: UsePingsPreviewAnimationsProps) {
  const hasEntered = useRef(false);
  const isAnimating = useRef(false);
  const lastStep = useRef(currentIndex);

  // These refs are intentionally retained by the hook API. Their visual
  // treatment is owned by ReflectionThumbnail while the wrappers travel.
  void stickyRef;
  void topReflectionRef;
  void mainVideoRef;
  void bottomReflectionRef;

  // ---------------------------------------------------------------------
  // 1. Entrance animation — runs once, the first time refs are attached.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (hasEntered.current) return;
    if (!headingRef.current || !phoneWrapperRef.current) return;

    hasEntered.current = true;

    animate(headingRef.current, {
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 900,
      ease: "outExpo",
    });

    animate(phoneWrapperRef.current, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 900,
      ease: "outExpo",
    });

    animate(avatarRefs.current.filter(Boolean), {
      opacity: [0, 1],
      scale: [0.8, 1],
      delay: (_el: HTMLDivElement, i: number) => i * 70,
      duration: 700,
      ease: "outBack",
    });
  });

  // ---------------------------------------------------------------------
  // 2. Scroll-driven promotion chain.
  //
  // Each wrapper is animated from its own measured rect to the next slot.
  // Anime.js composes those transforms with the authored rotations already
  // present in the JSX. At the handoff, cleanInlineStyles restores precisely
  // those authored resting transforms in the same frame as the React update.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const maxStep = Math.max(videos.length - 3, 0);
    if (maxStep <= 0) return;

    let ticking = false;
    let activeTimeline: ReturnType<typeof createTimeline> | null = null;

    function computeProgress() {
      if (!sectionRef.current) return 0;

      const rect = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;

      if (total <= 0) return 0;

      return Math.min(Math.max(-rect.top / total, 0), 1);
    }

    function getSlots() {
      const topEl = topReflectionWrapperRef.current;
      const mainEl = mainVideoWrapperRef.current;
      const bottomEl = bottomReflectionWrapperRef.current;

      if (!topEl || !mainEl || !bottomEl) return null;

      return {
        topEl,
        mainEl,
        bottomEl,
        topRect: topEl.getBoundingClientRect(),
        mainRect: mainEl.getBoundingClientRect(),
        bottomRect: bottomEl.getBoundingClientRect(),
      };
    }

    function finish(step: 1 | -1, timeline: ReturnType<typeof createTimeline>) {
      flushSync(() => {
        setCurrentIndex((previousIndex) =>
          Math.min(Math.max(previousIndex + step, 0), maxStep),
        );
      });

      cleanInlineStyles(timeline);
      activeTimeline = null;
      isAnimating.current = false;
    }

    function promote() {
      if (isAnimating.current) return;

      const slots = getSlots();
      if (!slots) return;

      isAnimating.current = true;
      lastStep.current += 1;

      const topToMain = slotTransform(slots.topRect, slots.mainRect);
      const mainToBottom = slotTransform(slots.mainRect, slots.bottomRect);
      const exit = {
        translateX: 0,
        translateY: slots.bottomRect.height * 1.35,
        scaleX: EXIT_SCALE,
        scaleY: EXIT_SCALE,
      };

      let timeline: ReturnType<typeof createTimeline>;
      timeline = createTimeline({
        autoplay: false,
        defaults: { duration: PROMOTION_DURATION, ease: PROMOTION_EASE },
        onComplete: () => finish(1, timeline),
      })
        .add(
          slots.topEl,
          {
            translateX: [0, topToMain.translateX],
            translateY: [0, topToMain.translateY],
            scaleX: [1, topToMain.scaleX],
            scaleY: [1, topToMain.scaleY],
            rotate: [topReflectionRotationDeg, mainVideoRotationDeg],
          },
          0,
        )
        .add(
          slots.mainEl,
          {
            translateX: [0, mainToBottom.translateX],
            translateY: [0, mainToBottom.translateY],
            scaleX: [1, mainToBottom.scaleX],
            scaleY: [1, mainToBottom.scaleY],
            rotate: [mainVideoRotationDeg, bottomReflectionRotationDeg],
          },
          0,
        )
        .add(
          slots.bottomEl,
          {
            translateX: [0, exit.translateX],
            translateY: [0, exit.translateY],
            scaleX: [1, exit.scaleX],
            scaleY: [1, exit.scaleY],
          },
          0,
        );

      activeTimeline = timeline;
      timeline.play();
    }

    function demote() {
      if (isAnimating.current) return;

      const slots = getSlots();
      if (!slots) return;

      isAnimating.current = true;
      lastStep.current -= 1;

      const topToMain = slotTransform(slots.topRect, slots.mainRect);
      const mainToBottom = slotTransform(slots.mainRect, slots.bottomRect);
      const exit = {
        translateX: 0,
        translateY: slots.bottomRect.height * 1.35,
        scaleX: EXIT_SCALE,
        scaleY: EXIT_SCALE,
      };

      let timeline: ReturnType<typeof createTimeline>;
      timeline = createTimeline({
        autoplay: false,
        defaults: { duration: PROMOTION_DURATION, ease: PROMOTION_EASE },
        onComplete: () => finish(-1, timeline),
      })
        .add(
          slots.topEl,
          {
            translateX: [topToMain.translateX, 0],
            translateY: [topToMain.translateY, 0],
            scaleX: [topToMain.scaleX, 1],
            scaleY: [topToMain.scaleY, 1],
            rotate: [mainVideoRotationDeg, topReflectionRotationDeg],
          },
          0,
        )
        .add(
          slots.mainEl,
          {
            translateX: [mainToBottom.translateX, 0],
            translateY: [mainToBottom.translateY, 0],
            scaleX: [mainToBottom.scaleX, 1],
            scaleY: [mainToBottom.scaleY, 1],
            rotate: [bottomReflectionRotationDeg, mainVideoRotationDeg],
          },
          0,
        )
        .add(
          slots.bottomEl,
          {
            translateX: [exit.translateX, 0],
            translateY: [exit.translateY, 0],
            scaleX: [exit.scaleX, 1],
            scaleY: [exit.scaleY, 1],
          },
          0,
        );

      activeTimeline = timeline;
      timeline.play();
    }

    function handleScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;

        if (isAnimating.current) return;

        const progress = computeProgress();
        const targetStep = Math.min(Math.floor(progress * maxStep), maxStep);

        if (targetStep === lastStep.current) return;

        if (targetStep > lastStep.current) {
          promote();
        } else {
          demote();
        }
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      activeTimeline?.cancel();
      isAnimating.current = false;
    };
    // Intentionally re-running only when the pool size changes — currentIndex
    // is driven by this effect (via promote/demote), not the other way around.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    videos.length,
    sectionRef,
    topReflectionWrapperRef,
    mainVideoWrapperRef,
    bottomReflectionWrapperRef,
    setCurrentIndex,
  ]);
}
