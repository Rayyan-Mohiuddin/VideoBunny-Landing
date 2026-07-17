import { NextResponse } from "next/server";

const DUMMY_URL = "https://dummyjson.com/users?limit=10";

const PEXELS_URL =
  "https://api.pexels.com/videos/search?query=people&per_page=10";

export async function GET() {
  try {
    const pexelsKey = process.env.PEXELS_API_KEY;

    if (!pexelsKey) {
      return NextResponse.json(
        {
          error: "PEXELS_API_KEY is missing from .env.local",
        },
        {
          status: 500,
        },
      );
    }

    const [usersRes, videosRes] = await Promise.all([
      fetch(DUMMY_URL, {
        cache: "no-store",
      }),

      fetch(PEXELS_URL, {
        headers: {
          Authorization: pexelsKey,
        },
        cache: "no-store",
      }),
    ]);

    if (!usersRes.ok || !videosRes.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch APIs",
        },
        {
          status: 500,
        },
      );
    }

    const usersJson = await usersRes.json();
    const videosJson = await videosRes.json();

    const users = usersJson.users;
    const videos = videosJson.videos;

    const creators = users.map((user: any) => {
      const video = videos[user.id % videos.length];

      return {
        id: user.id,

        username: user.username,

        avatar: user.image,

        name: `${user.firstName} ${user.lastName}`,

        video,
      };
    });

    return NextResponse.json(creators);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}
