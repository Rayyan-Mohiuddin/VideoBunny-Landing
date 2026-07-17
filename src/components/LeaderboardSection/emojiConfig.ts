import type { StaticImageData } from "next/image";

import crown from "@/assets/crown-dynamic-color.png";
import gift from "@/assets/gift-dynamic-color.png";
import heart from "@/assets/heart-dynamic-color.png";
import money from "@/assets/money-dynamic-color.png";
import notifyHeart from "@/assets/notify-heart-dynamic-color.png";
import star from "@/assets/star-dynamic-color.png";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

export type FloatType =
  | "crown"
  | "heart"
  | "gift"
  | "money"
  | "notify"
  | "star";

export interface EmojiConfig {
  id: string;
  image: StaticImageData;
  width: number;

  // Final desktop position, relative to the phone center.
  x: number;
  y: number;

  // Explosion stagger order (ms offset within the explosion phase).
  delay: number;

  float: FloatType;
}

export const emojiConfig: EmojiConfig[] = [
  {
    id: "crown",
    image: crown,
    width: 140,
    x: 140,
    y: -300,
    delay: 0,
    float: "crown",
  },
  {
    id: "star",
    image: star,
    width: 84,
    x: -215,
    y: -250,
    delay: 140,
    float: "star",
  },
  {
    id: "money",
    image: money,
    width: 88,
    x: isMobile ? 185 : 215,
    y: -80,
    delay: 140,
    float: "money",
  },
  {
    id: "notify",
    image: notifyHeart,
    width: 96,
    x: -215,
    y: -30,
    delay: 280,
    float: "notify",
  },
  {
    id: "heart",
    image: heart,
    width: 110,
    x: -210,
    y: 300,
    delay: 420,
    float: "heart",
  },
  {
    id: "gift",
    image: gift,
    width: 130,
    x: 160,
    y: 280,
    delay: 420,
    float: "gift",
  },
];

// Per-emoji idle parameters: each one is differently timed so the
// composition never feels synchronized or repetitive.
export const floatIdleConfig: Record<
  FloatType,
  {
    ampX: number;
    ampY: number;
    rotateAmp: number;
    scaleAmp: number;
    speed: number;
    phase: number;
  }
> = {
  crown: {
    ampX: isMobile ? 8 : 3,
    ampY: isMobile ? 10 : 7,
    rotateAmp: 3,
    scaleAmp: 0,
    speed: 0.45,
    phase: 0,
  },
  star: {
    ampX: 0,
    ampY: 4,
    rotateAmp: 0,
    scaleAmp: 0.05,
    speed: 0.9,
    phase: 1.1,
  },
  money: {
    ampX: 4,
    ampY: 6,
    rotateAmp: 6,
    scaleAmp: 0,
    speed: 0.55,
    phase: 2.3,
  },
  notify: {
    ampX: 5,
    ampY: 3,
    rotateAmp: 0,
    scaleAmp: 0.03,
    speed: 1.2,
    phase: 0.6,
  },
  heart: {
    ampX: 0,
    ampY: 8,
    rotateAmp: 0,
    scaleAmp: 0,
    speed: 0.65,
    phase: 3.4,
  },
  gift: { ampX: 4, ampY: 4, rotateAmp: 0, scaleAmp: 0, speed: 0.5, phase: 4.2 },
};
