import prisma from "../DB/db.config";
import dotenv from "dotenv";
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
        }
      | PromiseLike<{
          adminSecret: any;
          title: any;
          description: any;
          imageUrl: any;
          slug: any;
          appxCourseId: any;
          discordRoleId: any;
        }>;
    session: any;
  },
  res: {
    [x: string]: any;
    status: (code: number) => any;
    json: (data: any) => any;
  }
) => {
  console.log("addnewcourse in backend");
  try {
    const addcourse = await req.body;
    const {
      adminSecret,
      title,
      description,
      imageUrl,
      slug,
      appxCourseId,
      discordRoleId,
    } = addcourse;

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res
        .status(200)
        .json({ success: false, message: "Unauthorized you are not admin" });
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
      },
    });
    console.log("course added successfully in frontend");

    return res.status(200).json({
      success: true,
      data: { course_added },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Error logging in:", error);
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
    // get all the courses from database
    const new_courses = await prisma.course.findMany();
    return res.status(200).json({
      success: true,
      new_courses,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
