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
      sellingPrice,
      listPrice,
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
        sellingPrice: parseInt(sellingPrice),
        listPrice: parseInt(listPrice),
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
    console.log("User tries to purchase a course", req.session);

    // Fetch user details from the session
    const { user, sessionToken } = req.session;
    if (!user || !sessionToken) {
      return res.status(200).json({ success: false, message: "Unauthorized" });
    }
    console.log("user id in backend", user.id);
    const { courseId } = req.body;
    console.log("courseId", courseId);

    // create a new course in the database
    const course_added = await prisma.userPurchases.create({
      data: {
        course: {
          connect: {
            appxCourseId: courseId, // Connect using appxCourseId
          },
        },
        user: { connect: { id: user.id } },
      },
    });
    console.log("course added successfully in frontend");
    // Response with user details
    return res.status(200).json({
      success: false,
      course_added,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
