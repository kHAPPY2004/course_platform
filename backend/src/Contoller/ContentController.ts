import prisma from "../DB/db.config";
import redisClient from "../DB/redis.config";
import dotenv from "dotenv";
dotenv.config();

export const addCourseContent = async (
  req: {
    body:
      | {
          adminSecret: string;
          title: string;
          description: string;
          type: string;
          hidden: string;
          thumbnail: string;
          parentId: number;
          notionMetadataId: number;
        }
      | PromiseLike<{
          adminSecret: any;
          title: any;
          description: any;
          type: any;
          hidden: any;
          parentId: any;
          thumbnail: any;
          notionMetadataId: any;
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
    const addcourse = await req.body;
    if (!addcourse) {
      return res
        .status(400)
        .json({ message: "Invalid Information...", success: false });
    }
    const {
      adminSecret,
      title,
      description,
      type,
      hidden,
      thumbnail,
      parentId,
      notionMetadataId,
    } = addcourse;
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res
        .status(200)
        .json({ success: false, message: "Unauthorized you are not admin" });
    }

    // delete the content from redis
    const getcontent = `data:content`;
    try {
      await redisClient.del(getcontent);
    } catch (redisError) {
      return res
        .status(500)
        .json({ message: "Error while talking to redis..." });
    }

    if (type === "folder") {
      // create a new course in the database
      const content_added = await prisma.content.create({
        data: {
          type,
          title,
          hidden,
          description,
          thumbnail,
          notionMetadataId: parseInt(notionMetadataId),
        },
        include: {
          children: true, // Include the children of the newly created content
        },
      });

      return res.status(200).json({
        success: true,
        data: { content_added },
        message: "Course folder added successfully",
      });
    } else if (type === "video") {
      const parentContent = await prisma.content.findUnique({
        where: { id: parseInt(parentId) },
      });
      if (!parentContent) {
        return res
          .status(200)
          .json({ success: false, message: "Parent content not found." });
      }
      if (parentContent.notionMetadataId !== parseInt(notionMetadataId)) {
        return res.status(200).json({
          success: false,
          message: "Parent and course folder mismatched",
        });
      }
      // create a new course video in the database
      const content_added = await prisma.content.create({
        data: {
          type,
          title,
          hidden,
          description,
          thumbnail,
          parent: { connect: { id: parseInt(parentId) } }, // i am creating the parent node
          notionMetadataId: parentContent.notionMetadataId,
        },
        include: {
          children: true, // Include the children of the newly created content
        },
      });

      return res.status(200).json({
        success: true,
        data: { content_added },
        message: "Course Video added successfully",
      });
    } else {
      return res.status(200).json({
        success: false,
        data: {},
        message: "failed",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};

export const getContentfolder = async (
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
      return res.status(200).json({ success: false, message: "Unauthorized" });
    }

    const getallcontent = `data:content`;
    const getContent = await redisClient.get(getallcontent);
    if (getContent) {
      const getContentparse = JSON.parse(getContent);
      console.log("Retrieved content from cache ...");
      return res.status(200).json({
        success: true,
        data: getContentparse,
      });
    }
    // get all the courses from database

    const allcontents = await prisma.content.findMany();
    if (!allcontents) {
      return res.status(400).json({
        success: false,
      });
    }
    console.log("Retrieved content from database...");
    // set the content in redis
    await redisClient.set(getallcontent, JSON.stringify(allcontents));

    return res.status(200).json({
      success: true,
      data: allcontents,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
