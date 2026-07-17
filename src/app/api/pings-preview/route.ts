import { NextResponse } from "next/server";

import {
  PreviewUser,
  PreviewVideo,
  PingsPreviewResponse,
} from "@/types/pings-preview";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;

export async function GET() {
  try {
    const [usersRes, videosRes] = await Promise.all([
      fetch("https://dummyjson.com/users?limit=8", {
        cache: "no-store",
      }),
      fetch("https://api.pexels.com/videos/search?query=cinematic&per_page=8", {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        cache: "no-store",
      }),
    ]);

    if (!usersRes.ok) {
      throw new Error("Failed to fetch DummyJSON users.");
    }

    if (!videosRes.ok) {
      throw new Error("Failed to fetch Pexels videos.");
    }

    const usersJson = await usersRes.json();
    const videosJson = await videosRes.json();

    const users: PreviewUser[] = usersJson.users.map((user: any) => ({
      id: user.id,
      username: user.username,
      avatar: user.image,
      fullName: `${user.firstName} ${user.lastName}`,
    }));

    const videos: PreviewVideo[] = videosJson.videos.map((video: any) => {
      const bestVideoFile =
        video.video_files.find(
          (file: any) => file.quality === "hd" && file.width >= 720,
        ) ||
        video.video_files.find((file: any) => file.width >= 720) ||
        video.video_files[0];

      return {
        id: video.id,
        duration: video.duration,
        width: video.width,
        height: video.height,
        image: video.image,
        url: bestVideoFile.link,
      };
    });

    const response: PingsPreviewResponse = {
      users,
      videos,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Pings Preview API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch pings preview data.",
      },
      {
        status: 500,
      },
    );
  }
}
