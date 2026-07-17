"use client";

import {
  useEffect,
  useRef,
  type MutableRefObject,
  type RefObject,
} from "react";
import { animate, type JSAnimation } from "animejs";
import type { LeaderboardUser } from "./types";
import { emojiConfig, floatIdleConfig } from "./emojiConfig";

export interface LeaderboardRefs {
  headingRef: RefObject<HTMLDivElement | null>;
  phoneRef: RefObject<HTMLDivElement | null>;
  gradientRef: RefObject<HTMLDivElement | null>;
  emojiRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  winnersTitleRef: RefObject<HTMLDivElement | null>;
  winnerRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  rankingsTitleRef: RefObject<HTMLDivElement | null>;
  rowRefs: MutableRefObject<(HTMLDivElement | null)[]>;
}

// ---------------------------------------------------------------------------
// Easing / interpolation helpers. Everything below is pure math so the same
// progress value can be scrubbed forward or backward without ever "replaying"
// an animation that's already in flight — it just maps to a position.
// ---------------------------------------------------------------------------

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const easeOutBack = (t: number, overshoot = 1.7) => {
  const c1 = overshoot;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Maps progress p from [inMin, inMax] to [outMin, outMax], eased, clamped. */
const mapRange = (
  p: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  ease: (t: number) => number = easeOutCubic,
) => {
  const t = clamp01((p - inMin) / (inMax - inMin));
  return outMin + (outMax - outMin) * ease(t);
};

/** Piecewise-linear interpolation through keyframe stops, each [t, value], t in [0,1]. */
const keyframes = (t: number, stops: [number, number][]) => {
  const clamped = clamp01(t);
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, v0] = stops[i];
    const [t1, v1] = stops[i + 1];
    if (clamped >= t0 && clamped <= t1) {
      const local = t1 === t0 ? 1 : (clamped - t0) / (t1 - t0);
      return v0 + (v1 - v0) * easeOutCubic(local);
    }
  }
  return stops[stops.length - 1][1];
};

// ---------------------------------------------------------------------------
// Phase windows (fractions of overall scroll progress through the 320vh scene)
// ---------------------------------------------------------------------------

const PHASE = {
  headingStart: 0.05,
  headingEnd: 0.16,

  phoneStart: 0.16,
  phoneEnd: 0.3,

  gradientStart: 0.3,
  gradientEnd: 0.38,

  explosionStart: 0.38,
  explosionEnd: 0.58,

  winnersTitleStart: 0.58,
  winnersTitleEnd: 0.63,
  winnersStart: 0.63,
  winnersEnd: 0.72,

  rankingsTitleStart: 0.72,
  rankingsTitleEnd: 0.76,

  rowsStart: 0.76,
  rowsEnd: 0.92,

  holdStart: 0.92,

  exitStart: 0.95,
  exitEnd: 1,
};

const MAX_EMOJI_DELAY = Math.max(...emojiConfig.map((e) => e.delay));

export function useLeaderboardAnimations(
  progressRef: MutableRefObject<number>,
  refs: LeaderboardRefs,
  topCreators: LeaderboardUser[],
  rankedRows: LeaderboardUser[],
) {
  const breathingAnim = useRef<JSAnimation | null>(null);
  const winnerFired = useRef<boolean[]>([]);
  const rowFired = useRef<boolean[]>([]);

  useEffect(() => {
    if (!topCreators.length || !rankedRows.length) {
      return;
    }

    winnerFired.current = topCreators.map(() => false);
    rowFired.current = rankedRows.map(() => false);
    let frame: number;

    // Phone breathing — purely time-based idle loop, played/paused based on phase.
    if (refs.phoneRef.current) {
      breathingAnim.current = animate(refs.phoneRef.current, {
        scale: [1, 1.005, 1],
        duration: 5000,
        ease: "inOutSine",
        loop: true,
        autoplay: false,
      });
    }

    const animateScoreOnce = (
      el: HTMLElement | null,
      score: number,
      fired: boolean[],
      idx: number,
    ) => {
      if (!el || fired[idx]) return;

      fired[idx] = true;

      el.textContent = String(score);
    };

    const tick = () => {
      const p = progressRef.current;

      // Global exit fade/lift applied on top of everything else.
      const exitOpacity = mapRange(p, PHASE.exitStart, PHASE.exitEnd, 1, 0);
      const exitLift = mapRange(p, PHASE.exitStart, PHASE.exitEnd, 0, -60);

      // ---- Heading ------------------------------------------------------
      if (refs.headingRef.current) {
        const o = mapRange(p, PHASE.headingStart, PHASE.headingEnd, 0, 1);
        const y = mapRange(p, PHASE.headingStart, PHASE.headingEnd, 30, 0);
        refs.headingRef.current.style.opacity = String(o * exitOpacity);
        refs.headingRef.current.style.transform = `translateY(${y + exitLift}px)`;
      }

      // ---- Phone ----------------------------------------------------------
      if (refs.phoneRef.current) {
        const o = mapRange(p, PHASE.phoneStart, PHASE.phoneEnd, 0, 1);
        const scale = keyframes(
          mapRange(p, PHASE.phoneStart, PHASE.phoneEnd, 0, 1, (t) => t),
          [
            [0, 0.85],
            [0.65, 1.08],
            [1, 1],
          ],
        );
        refs.phoneRef.current.style.opacity = String(o * exitOpacity);
        refs.phoneRef.current.style.transform = `translateY(${exitLift}px) scale(${scale})`;

        // Phone breathing only once we've reached the hold phase.
        if (p >= PHASE.holdStart && p < PHASE.exitStart) {
          breathingAnim.current?.play();
        } else {
          breathingAnim.current?.pause();
        }
      }

      // ---- Blue gradient inside the phone ---------------------------------
      if (refs.gradientRef.current) {
        const o = mapRange(p, PHASE.gradientStart, PHASE.gradientEnd, 0, 1);
        const scaleY = mapRange(
          p,
          PHASE.gradientStart,
          PHASE.gradientEnd,
          0.92,
          1,
        );
        refs.gradientRef.current.style.opacity = String(o * exitOpacity);
        refs.gradientRef.current.style.transform = `scaleY(${scaleY})`;
      }

      // ---- Emoji explosion + idle float ------------------------------------
      const explosionDuration = PHASE.explosionEnd - PHASE.explosionStart;
      const now = performance.now() * 0.001;

      emojiConfig.forEach((cfg, i) => {
        const el = refs.emojiRefs.current[i];
        if (!el) return;

        const delayFrac =
          MAX_EMOJI_DELAY === 0 ? 0 : (cfg.delay / MAX_EMOJI_DELAY) * 0.4;
        const localStart = PHASE.explosionStart + delayFrac * explosionDuration;
        const localDuration = explosionDuration * 0.6;
        const t = clamp01((p - localStart) / localDuration);

        const scale = keyframes(t, [
          [0, 0],
          [0.6, 1.35],
          [0.85, 0.9],
          [1, 1],
        ]);
        const rotate = keyframes(t, [
          [0, -25],
          [0.6, 8],
          [1, 0],
        ]);
        const opacity = mapRange(t, 0, 0.3, 0, 1, (x) => x);
        const burst = easeOutBack(t);
        const tx = cfg.x * burst;
        const ty = cfg.y * burst;

        // Idle wobble fades in only once the burst has essentially settled.
        const idleBlend = mapRange(
          p,
          PHASE.explosionEnd,
          PHASE.explosionEnd + 0.03,
          0,
          1,
          (x) => x,
        );
        const idle = floatIdleConfig[cfg.float];
        const idleX =
          Math.sin(now * idle.speed + idle.phase) * idle.ampX * idleBlend;
        const idleY =
          Math.sin(now * idle.speed * 1.3 + idle.phase + 1) *
          idle.ampY *
          idleBlend;
        const idleRotate =
          Math.sin(now * idle.speed * 0.8 + idle.phase) *
          idle.rotateAmp *
          idleBlend;
        const idleScale =
          1 +
          Math.sin(now * idle.speed + idle.phase) * idle.scaleAmp * idleBlend;

        el.style.opacity = String(opacity * exitOpacity);
        el.style.transform = `
          translate(-50%, -50%)
          translate(${tx + idleX}px, ${ty + idleY + exitLift}px)
          rotate(${rotate + idleRotate}deg)
          scale(${scale * idleScale})
        `;
      });

      // ---- Winners title ----------------------------------------------------
      if (refs.winnersTitleRef.current) {
        const o = mapRange(
          p,
          PHASE.winnersTitleStart,
          PHASE.winnersTitleEnd,
          0,
          1,
        );
        refs.winnersTitleRef.current.style.opacity = String(o * exitOpacity);
        refs.winnersTitleRef.current.style.transform = `translateY(${exitLift}px)`;
      }

      // ---- Winner bubbles (1st -> 2nd -> 3rd) --------------------------------
      const winnersWindow = PHASE.winnersEnd - PHASE.winnersStart;
      topCreators.forEach((user, i) => {
        const el = refs.winnerRefs.current[i];
        if (!el) return;

        const localStart =
          PHASE.winnersStart + (i / topCreators.length) * winnersWindow * 0.7;
        const localDuration = winnersWindow * 0.55;
        const t = clamp01((p - localStart) / localDuration);

        const scale = keyframes(t, [
          [0, 0],
          [0.65, 1.2],
          [1, 1],
        ]);
        const y = mapRange(t, 0, 1, 20, 0, easeOutCubic);
        const o = mapRange(t, 0, 0.4, 0, 1, (x) => x);

        el.style.opacity = String(o * exitOpacity);
        el.style.transform = `translateY(${y + exitLift}px) scale(${scale})`;

        if (t >= 1) {
          const scoreEl = el.querySelector<HTMLElement>(".winner-score");
          animateScoreOnce(scoreEl, user.score, winnerFired.current, i);
        }
      });

      // ---- Rankings title -----------------------------------------------------
      if (refs.rankingsTitleRef.current) {
        const o = mapRange(
          p,
          PHASE.rankingsTitleStart,
          PHASE.rankingsTitleEnd,
          0,
          1,
        );
        refs.rankingsTitleRef.current.style.opacity = String(o * exitOpacity);
        refs.rankingsTitleRef.current.style.transform = `translateY(${exitLift}px)`;
      }

      // ---- Leaderboard rows, alternating left/right ---------------------------
      const rowsWindow = PHASE.rowsEnd - PHASE.rowsStart;
      rankedRows.forEach((user, i) => {
        const el = refs.rowRefs.current[i];
        if (!el) return;

        const localStart =
          PHASE.rowsStart + (i / rankedRows.length) * rowsWindow * 0.75;
        const localDuration = rowsWindow * 0.4;
        const t = clamp01((p - localStart) / localDuration);

        const fromX = i % 2 === 0 ? -40 : 40;
        const x = mapRange(t, 0, 1, fromX, 0, easeOutCubic);
        const o = mapRange(t, 0, 1, 0, 1, (x2) => x2);

        el.style.opacity = String(o * exitOpacity);
        el.style.transform = `translateX(${x}px) translateY(${exitLift}px)`;

        if (t >= 1) {
          const scoreEl = el.querySelector<HTMLElement>(".leaderboard-score");
          animateScoreOnce(scoreEl, user.score, rowFired.current, i);
        }
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      breathingAnim.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topCreators, rankedRows]);
}
