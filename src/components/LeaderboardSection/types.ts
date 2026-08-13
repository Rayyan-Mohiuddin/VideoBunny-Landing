import type { StaticImageData } from "next/image";

export interface LeaderboardVideo {
  image: string | StaticImageData;
}

export interface LeaderboardUser {
  id: number;

  rank: number;

  username: string;

  avatar: string | StaticImageData;

  score: number;

  video: LeaderboardVideo;
}
