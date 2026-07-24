"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, utils } from "animejs";

// NOTE: adjust this import path to wherever PING_IMAGES actually lives in
// your project (it's imported by PingsPreviewSection.tsx as "./assets").
import { PING_IMAGES } from "@/components/PingsPreviewSection/assets";

type DivRef = React.RefObject<HTMLDivElement | null>;
type ImgRef = React.RefObject<HTMLImageElement | null>;

interface UsePingsPreviewAnimationsParams {
  sectionRef: DivRef;
  stickyRef: DivRef;

  titleRef: DivRef;

  phoneWrapperRef: DivRef;

  screenRef: DivRef;
  screenImageRef: ImgRef;

  previousReflectionRef: DivRef;
  previousReflectionImageRef: ImgRef;

  nextReflectionRef: DivRef;
  nextReflectionImageRef: ImgRef;
}

type Direction = 1 | -1;

// ---- tunables (no magic numbers scattered through the logic) ----
const TITLE_DURATION_MS = 700;
const PHONE_DURATION_MS = 700;
const PING_DURATION_MS = 700;

const EASE = "outQuart";

// Ignore additional wheel/touch input for this long after a step finishes.
// Trackpads/mice/touch emit a long tail of small events for a single
// physical gesture; without this a single swipe can chain through
// several steps at once, which is what reads as "not smooth".
const WHEEL_COOLDOWN_MS = 450;

// How far (px) a touch drag has to travel before it counts as one step.
const TOUCH_STEP_THRESHOLD_PX = 40;

// If forward/backward feel swapped on your input device, flip this.
const REVERSE_SCROLL_DIRECTION = false;

const REFLECTION_ROTATE_Y_DEG = -32;
const REFLECTION_PERSPECTIVE_PX = 1800;

// Fallback only — the real travel distance is measured from the
// rendered (fluid, clamp()-based) reflection offset at runtime so it
// stays correct across breakpoints.
const CONVEYOR_TRAVEL_FALLBACK_PX = 220;

const TITLE_ENTRY_OFFSET_PX = 24;
const PHONE_ENTRY_SCALE_FROM = 0.92;

const REST_OPACITY = 0.5;

// Step 0: title + phone hidden
// Step 1: title visible
// Step 2: phone visible, images at their initial (default) positions
// Step 3..TOTAL_STEPS: one conveyor transition per step
// centerIndex (index of the image on the phone screen) = step - 1
export default function usePingsPreviewAnimations({
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
}: UsePingsPreviewAnimationsParams) {
  const stepRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isCoolingDownRef = useRef(false);
  const isLockedRef = useRef(false);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;
    const section: HTMLDivElement = sectionEl;

    const TOTAL_STEPS = PING_IMAGES.length;

    // ---------------------------------------------------------------
    // scroll locking
    // ---------------------------------------------------------------

    function lockScroll() {
      isLockedRef.current = true;
    }

    function unlockScroll() {
      isLockedRef.current = false;
    }

    // ---------------------------------------------------------------
    // one-time perf hints
    // ---------------------------------------------------------------

    function primeLayers() {
      [
        titleRef.current,
        phoneWrapperRef.current,
        screenRef.current,
        previousReflectionRef.current,
        nextReflectionRef.current,
      ].forEach((el) => {
        if (el) el.style.willChange = "transform, opacity";
      });
    }

    // ---------------------------------------------------------------
    // title / phone enter & exit
    // ---------------------------------------------------------------

    async function showTitle() {
      const el = titleRef.current;
      if (!el) return;
      await animate(el, {
        opacity: [0, 1],
        translateY: [TITLE_ENTRY_OFFSET_PX, 0],
        duration: TITLE_DURATION_MS,
        ease: EASE,
      });
    }

    async function hideTitle() {
      const el = titleRef.current;
      if (!el) return;
      await animate(el, {
        opacity: [1, 0],
        translateY: [0, TITLE_ENTRY_OFFSET_PX],
        duration: TITLE_DURATION_MS,
        ease: EASE,
      });
    }

    async function showPhone() {
      const el = phoneWrapperRef.current;
      if (!el) return;
      await animate(el, {
        opacity: [0, 1],
        scale: [PHONE_ENTRY_SCALE_FROM, 1],
        duration: PHONE_DURATION_MS,
        ease: EASE,
      });
    }

    async function hidePhone() {
      const el = phoneWrapperRef.current;
      if (!el) return;
      await animate(el, {
        opacity: [1, 0],
        scale: [1, PHONE_ENTRY_SCALE_FROM],
        duration: PHONE_DURATION_MS,
        ease: EASE,
      });
    }

    // ---------------------------------------------------------------
    // conveyor (pings) transition
    // ---------------------------------------------------------------

    // The reflection offset is fluid (clamp()-based) so it matches
    // whatever size the phone is currently rendered at. Read it back
    // from the DOM instead of hardcoding a px value.
    function getConveyorTravel(): number {
      const el = previousReflectionRef.current;
      if (!el) return CONVEYOR_TRAVEL_FALLBACK_PX;

      const top = window.getComputedStyle(el).top;
      const value = Math.abs(parseFloat(top));

      return Number.isFinite(value) && value > 0
        ? value
        : CONVEYOR_TRAVEL_FALLBACK_PX;
    }

    // Source of truth for what should be showing: derive every image src
    // directly from PING_IMAGES + the step, instead of copying old src
    // values forward. This makes forward and reverse symmetric for free.
    function syncImages(step: number) {
      const centerIndex = step - 1;

      const prevImg = previousReflectionImageRef.current;
      const screenImg = screenImageRef.current;
      const nextImg = nextReflectionImageRef.current;

      const prevSrc = PING_IMAGES[centerIndex - 1]?.src;
      const currentSrc = PING_IMAGES[centerIndex]?.src;
      const nextSrc = PING_IMAGES[centerIndex + 1]?.src;

      if (prevImg && prevSrc) prevImg.src = prevSrc;
      if (screenImg && currentSrc) screenImg.src = currentSrc;
      if (nextImg && nextSrc) nextImg.src = nextSrc;
    }

    function resetTransforms(step: number) {
      const centerIndex = step - 1;
      const hasPrev = Boolean(PING_IMAGES[centerIndex - 1]);
      const hasNext = Boolean(PING_IMAGES[centerIndex + 1]);

      const prevEl = previousReflectionRef.current;
      const screenEl = screenRef.current;
      const nextEl = nextReflectionRef.current;

      if (prevEl) {
        utils.set(prevEl, {
          translateY: 0,
          opacity: hasPrev ? REST_OPACITY : 0,
          rotateY: REFLECTION_ROTATE_Y_DEG,
          perspective: REFLECTION_PERSPECTIVE_PX,
        });
      }

      if (screenEl) {
        utils.set(screenEl, {
          translateY: 0,
          rotateY: REFLECTION_ROTATE_Y_DEG,
          perspective: REFLECTION_PERSPECTIVE_PX,
        });
      }

      if (nextEl) {
        utils.set(nextEl, {
          translateY: 0,
          opacity: hasNext ? REST_OPACITY : 0,
          rotateY: REFLECTION_ROTATE_Y_DEG,
          perspective: REFLECTION_PERSPECTIVE_PX,
        });
      }
    }

    // direction = 1 -> conveyor moves up (advancing forward)
    // direction = -1 -> conveyor moves down (reversing)
    function animatePingTransition(
      direction: Direction,
      newStep: number,
    ): Promise<void> {
      return new Promise((resolve) => {
        const prevEl = previousReflectionRef.current;
        const screenEl = screenRef.current;
        const nextEl = nextReflectionRef.current;

        if (!prevEl || !screenEl || !nextEl) return resolve();

        const travelPx = getConveyorTravel();
        const travel = -travelPx * direction;
        const outOpacity = direction === 1 ? 0 : REST_OPACITY;

        const timeline = createTimeline({
          defaults: {
            ease: EASE,
            duration: PING_DURATION_MS,
          },
          onComplete: () => {
            syncImages(newStep);
            resetTransforms(newStep);
            resolve();
          },
        });

        timeline
          .add(
            prevEl,
            {
              translateY: travel,
              opacity: outOpacity,
              rotateY: REFLECTION_ROTATE_Y_DEG,
              perspective: REFLECTION_PERSPECTIVE_PX,
            },
            0,
          )
          .add(
            screenEl,
            {
              translateY: travel,
              rotateY: REFLECTION_ROTATE_Y_DEG,
              perspective: REFLECTION_PERSPECTIVE_PX,
            },
            0,
          )
          .add(
            nextEl,
            {
              translateY: travel,
              rotateY: REFLECTION_ROTATE_Y_DEG,
              perspective: REFLECTION_PERSPECTIVE_PX,
            },
            0,
          );
      });
    }

    // ---------------------------------------------------------------
    // step machine (bidirectional)
    // ---------------------------------------------------------------

    async function stepForward() {
      const from = stepRef.current;
      if (from >= TOTAL_STEPS) return;
      const to = from + 1;
      stepRef.current = to;

      if (from === 0) {
        lockScroll();
        await showTitle();
      } else if (from === 1) {
        await showPhone();
      } else {
        await animatePingTransition(1, to);
      }

      if (to >= TOTAL_STEPS) {
        unlockScroll();
      }
    }

    async function stepBackward() {
      const from = stepRef.current;
      if (from <= 0) return;

      if (from >= TOTAL_STEPS) {
        // was resting in the finished/unlocked state, re-lock to reverse
        lockScroll();
      }

      const to = from - 1;
      stepRef.current = to;

      if (to === 1) {
        await hidePhone();
      } else if (to === 0) {
        await hideTitle();
        unlockScroll();
      } else {
        await animatePingTransition(-1, to);
      }
    }

    async function step(direction: Direction) {
      isAnimatingRef.current = true;
      try {
        if (direction === 1) {
          await stepForward();
        } else {
          await stepBackward();
        }
      } finally {
        isAnimatingRef.current = false;
        isCoolingDownRef.current = true;
        window.setTimeout(() => {
          isCoolingDownRef.current = false;
        }, WHEEL_COOLDOWN_MS);
      }
    }

    // ---------------------------------------------------------------
    // input handling (wheel + touch share this)
    // ---------------------------------------------------------------

    function resolveDirection(deltaY: number): Direction | 0 {
      if (deltaY === 0) return 0;
      const scrollingForward = deltaY > 0;
      const isForward = REVERSE_SCROLL_DIRECTION
        ? !scrollingForward
        : scrollingForward;
      return isForward ? 1 : -1;
    }

    function shouldIntercept(direction: Direction): boolean {
      const atStart = stepRef.current <= 0;
      const atEnd = stepRef.current >= TOTAL_STEPS;

      // let normal page scroll take over once fully finished, or before
      // the sequence has started at all
      if (direction === 1 && atEnd) return false;
      if (direction === -1 && atStart) return false;
      return true;
    }

    function tryStep(direction: Direction | 0) {
      if (direction === 0) return;
      if (isAnimatingRef.current || isCoolingDownRef.current) return;
      void step(direction);
    }

    function handleWheel(event: WheelEvent) {
      const direction = resolveDirection(event.deltaY);
      if (direction === 0) return;
      if (!shouldIntercept(direction)) return;

      event.preventDefault();
      tryStep(direction);
    }

    let touchStartY = 0;
    let touchAccumulated = 0;

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) return;
      touchStartY = event.touches[0].clientY;
      touchAccumulated = 0;
    }

    function handleTouchMove(event: TouchEvent) {
      if (event.touches.length !== 1) return;

      const currentY = event.touches[0].clientY;
      const deltaY = touchStartY - currentY; // finger up -> positive -> forward
      touchStartY = currentY;

      const direction = resolveDirection(deltaY);
      if (direction === 0) return;
      if (!shouldIntercept(direction)) return;

      event.preventDefault();

      touchAccumulated += deltaY;
      if (Math.abs(touchAccumulated) < TOUCH_STEP_THRESHOLD_PX) return;

      const stepDirection = resolveDirection(touchAccumulated);
      touchAccumulated = 0;
      tryStep(stepDirection);
    }

    function handleTouchEnd() {
      touchAccumulated = 0;
    }

    // ---------------------------------------------------------------
    // entering the section
    // ---------------------------------------------------------------

    function handleEnter() {
      if (hasEnteredRef.current) return;

      hasEnteredRef.current = true;
      primeLayers();
      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    // A naive "any pixel visible" intersection check fires while the
    // section is still mostly off-screen (it's much taller than the
    // viewport), which starts the sequence before the sticky panel has
    // actually pinned to the top. Instead, wait until the sticky panel
    // itself is genuinely pinned (its top has reached the viewport top
    // and its bottom hasn't scrolled past it yet).
    let rafId: number | null = null;

    function checkPinned() {
      rafId = null;
      if (hasEnteredRef.current) return;

      const rect = section.getBoundingClientRect();
      const isPinned = rect.top <= 0 && rect.bottom > window.innerHeight;

      if (isPinned) {
        handleEnter();
      }
    }

    function scheduleCheck() {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(checkPinned);
    }

    // in case the page loads already scrolled into the pinned range
    scheduleCheck();

    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck);

    return () => {
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
