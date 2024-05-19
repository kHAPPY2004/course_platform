import prisma from "../DB/db.config";
import dotenv from "dotenv";
import redisClient from "../DB/redis.config";
dotenv.config();
export const addnewCourse = async (
  req: {
    body:
      | {
          adminSecret: string;
          title: string;
          description: string;
          imageUrl: string;
          slug: string;
          appxCourseId: number;
          discordRoleId: string;
          sellingPrice: number;
          listPrice: number;
        }
      | PromiseLike<{
          adminSecret: any;
          title: any;
          description: any;
          imageUrl: any;
          slug: any;
          appxCourseId: any;
          discordRoleId: any;
          sellingPrice: any;
          listPrice: any;
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
        .json({ message: "Course is required to add ...", success: false });
    }
    const {
      adminSecret,
      title,
      description,
      imageUrl,
      slug,
      appxCourseId,
      discordRoleId,
      sellingPrice,
      listPrice,
    } = addcourse;

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res
        .status(200)
        .json({ success: false, message: "Unauthorized you are not admin" });
    }

    // delete the courses from redis
    const getallcourses = `data:courses`;
    try {
      await redisClient.del(getallcourses);
    } catch (redisError) {
      return res
        .status(500)
        .json({ message: "Error while talking to redis..." });
    }

    // create a new course in the database
    const course_added = await prisma.course.create({
      data: {
        appxCourseId: parseInt(appxCourseId), // Your appx course ID
        discordRoleId, // Your Discord role ID
        title,
        imageUrl,
        description,
        openToEveryone: false, // Whether the course is open to everyone or not
        slug,
        sellingPrice: parseInt(sellingPrice),
        listPrice: parseInt(listPrice),
      },
    });

    return res.status(200).json({
      success: true,
      data: { course_added },
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
export const getallCourses = async (
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

    const getallcourses = `data:courses`;
    const all_courses = await redisClient.get(getallcourses);
    if (all_courses) {
      const all_coursesparse = JSON.parse(all_courses);
      console.log("Retrieved courses from cache ...");
      return res.status(200).json({
        success: true,
        data: all_coursesparse,
      });
    }

    // get all the courses from database
    const new_courses = await prisma.course.findMany();
    if (!new_courses) {
      return res.status(400).json({
        success: false,
      });
    }
    console.log("Retrieved courses from database....");
    await redisClient.set(getallcourses, JSON.stringify(new_courses));

    return res.status(200).json({
      success: true,
      data: new_courses,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
export const coursePurchase = async (
  req: {
    body: any;
    session: any;
  },
  res: {
    [x: string]: any;
    status: (code: number) => any;
    json: (data: any) => any;
  }
) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Invalid information...", success: false });
    }
    // Fetch user details from the session
    const { user, sessionToken } = req.session;
    if (!user || !sessionToken) {
      return res
        .status(200)
        .json({ success: false, data: user, message: "Unauthorized" });
    }

    // delete the redis key before adding new course purchase to user
    const userPurchasesCacheKey = `data:userpurchases:${user.id}`;
    try {
      await redisClient.del(userPurchasesCacheKey);
    } catch (redisError) {
      return res.status(500).json({ message: "Error deleting Redis key:" });
    }

    // create a new course in the database
    const course_added = await prisma.userPurchases.create({
      data: {
        course: {
          connect: {
            id: id, // Connect using id
          },
        },
        user: { connect: { id: user.id } },
      },
    });
    // Response with user details
    return res.status(200).json({
      success: true,
      data: [course_added],
      message: "Course Purchase success...",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
