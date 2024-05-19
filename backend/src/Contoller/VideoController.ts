import prisma from "../DB/db.config";
import redisClient from "../DB/redis.config";
import dotenv from "dotenv";
dotenv.config();
export const addVideoMetadata = async (
  req: {
    body:
      | {
          adminSecret: string;
          video_360p_1: string;
          video_720p_1: string;
          video_1080p_1: string;
          contentId: number;
        }
      | PromiseLike<{
          adminSecret: string;
          video_360p_1: string;
          video_720p_1: string;
          video_1080p_1: string;
          contentId: number;
        }>;
    session: any;
  },
  res: {
    [x: string]: any;
    status: (code: number) => any;
    json: (data: any) => any;
  }
) => {
  try {
    const addVideo = await req.body;
    if (!addVideo) {
      return res
        .status(400)
        .json({ message: "Video is required", success: false });
    }
    const {
      adminSecret,
      video_360p_1,
      video_720p_1,
      video_1080p_1,
      contentId,
    } = addVideo;

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res
        .status(200)
        .json({ success: false, message: "Unauthorized you are not admin" });
    }
    const parentContent = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!parentContent) {
      return res
        .status(200)
        .json({ success: false, message: "Parent content not found." });
    }
    // create a new course in the database
    const video_added = await prisma.videoMetadata.create({
      data: {
        video_360p_1,
        video_720p_1,
        video_1080p_1,
        content: { connect: { id: contentId } },
      },
    });

    return res.status(200).json({
      success: true,
      data: { video_added },
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
export const getVideoMetadata = async (
  req: {
    session: any;
  },
  res: {
    [x: string]: any;
    status: (code: number) => any;
    json: (data: any) => any;
  }
) => {
  try {
    // Fetch user details from the session
    const { user, sessionToken } = req.session;
    if (!user || !sessionToken) {
      return res
        .status(200)
        .json({ success: false, data: user, message: "Unauthorized" });
    }
    const getallvideos = `data:videometadata`;
    const getVideos = await redisClient.get(getallvideos);
    if (getVideos) {
      const getVideosparse = JSON.parse(getVideos);
      console.log("Retrieved videos from cache ...");
      return res.status(200).json({
        success: true,
        data: getVideosparse,
      });
    }
    // get all the courses from database

    const allVideos = await prisma.videoMetadata.findMany();
    if (!allVideos) {
      return res.status(400).json({
        success: false,
      });
    }
    console.log("Retrieved videos from database...");
    await redisClient.set(getallvideos, JSON.stringify(allVideos));

    return res.status(200).json({
      success: true,
      data: allVideos,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
