import type { LeaderboardUser } from "./types";

const scores = [113, 81, 62, 54, 49, 44, 40, 35, 29, 21];

export async function getLeaderboardData(): Promise<LeaderboardUser[]> {
  const res = await fetch("/api/leaderboard");

  if (!res.ok) {
    const text = await res.text();
    console.error(text);
    throw new Error("Failed to load leaderboard.");
  }

  const creators = await res.json();

  return creators.map((creator: any, index: number) => ({
    id: creator.id,

    rank: index + 1,

    username: creator.username,

    avatar: creator.avatar,

    score: scores[index] ?? 0,

    video: creator.video,
  }));
}
