import ping1 from "@/assets/pings-preview/ping1.jpg";
import ping2 from "@/assets/pings-preview/ping2.jpg";
import ping3 from "@/assets/pings-preview/ping3.jpg";
import ping4 from "@/assets/pings-preview/ping4.jpg";
import ping5 from "@/assets/pings-preview/ping5.jpg";
import f1 from "@/assets/f1.png";
import f2 from "@/assets/f2.png";
import f3 from "@/assets/f3.png";
import f4 from "@/assets/f4.png";
import f5 from "@/assets/f5.png";
import f6 from "@/assets/f6.png";

import type { LeaderboardUser } from "./types";

const thumbnails = [ping1, ping2, ping3, ping4, ping5, ping1, ping2, ping3, ping4, ping5];
const avatars = [f1, f2, f3, f4, f5, f6, f1, f2, f3, f4];

const usernames = [
  "mira",
  "kai",
  "luna",
  "noah",
  "zara",
  "leo",
  "aya",
  "rex",
  "nina",
  "joe",
];

const scores = [113, 81, 62, 54, 49, 44, 40, 35, 29, 21];

const STATIC_LEADERBOARD: LeaderboardUser[] = usernames.map((username, index) => ({
  id: index + 1,
  rank: index + 1,
  username,
  avatar: avatars[index],
  score: scores[index],
  video: {
    image: thumbnails[index],
  },
}));

export async function getLeaderboardData(): Promise<LeaderboardUser[]> {
  return STATIC_LEADERBOARD;
}
