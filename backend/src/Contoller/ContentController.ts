import prisma from "../DB/db.config";
import redisClient from "../DB/redis.config";
import dotenv from "dotenv";
dotenv.config();
// to add the folder part
// export const addCourseContent = async (
//   req: {
//     body:
//       | {
//           adminSecret: string;
//           title: string;
//           description: string;
//           type: string;
//           hidden: string;
//           thumbnail: string;
//           parentId: number;
//           notionMetadataId: number;
//         }
//       | PromiseLike<{
//           adminSecret: any;
//           title: any;
//           description: any;
//           type: any;
//           hidden: any;
//           thumbnail: any;
//           parentId: any;
//           notionMetadataId: any;
//         }>;
//     session: any;
//   },
//   res: {
//     [x: string]: any;
//     status: (code: number) => any;
//     json: (data: any) => any;
//   }
// ) => {
//   console.log("addnewcourse in backend");
//   try {
//     const addcourse = await req.body;
//     const {
//       adminSecret,
//       title,
//       description,
//       type,
//       hidden,
//       thumbnail,
//       parentId,
//       notionMetadataId,
//     } = addcourse;
//     console.log("hidden", typeof hidden, hidden);
//     if (adminSecret !== process.env.ADMIN_SECRET) {
//       return res
//         .status(200)
//         .json({ success: false, message: "Unauthorized you are not admin" });
//     }
//     // const parentContent = await prisma.content.findUnique({
//     //   where: { id: parseInt(parentId) },
//     // });

//     // if (!parentContent) {
//     //   return res
//     //     .status(200)
//     //     .json({ success: false, message: "Parent content not found." });
//     // }
//     // create a new course in the database
//     const content_added = await prisma.content.create({
//       data: {
//         type,
//         title,
//         hidden,
//         description,
//         thumbnail,
//         // parent: { connect: { id: parseInt(parentId) } }, // i am creating the parent node
//         notionMetadataId: parseInt(notionMetadataId),
//       },
//       include: {
//         children: true, // Include the children of the newly created content
//       },
//     });
//     console.log("content added successfully in frontend");

//     // create a field in the coursecontent
//     const course_added = await prisma.courseContent.create({
//       data: {
//         content: {
//           connect: {
//             id: content_added.id, // Connect using appxCourseId
//           },
//         },
//         course: { connect: { id: notionMetadataId } },
//       },
//     });
//     return res.status(200).json({
//       success: true,
//       data: { content_added },
//       message: "User logged in successfully",
//     });
//   } catch (error) {
//     console.error("Error logging in:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// to add the video part
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
          thumbnail: any;
          parentId: any;
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
  console.log("addnewcourse in backend");
  try {
    const addcourse = await req.body;
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
    console.log("hidden", typeof hidden, hidden);
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res
        .status(200)
        .json({ success: false, message: "Unauthorized you are not admin" });
    }
    const parentContent = await prisma.content.findUnique({
      where: { id: parseInt(parentId) },
    });

    if (!parentContent) {
      return res
        .status(200)
        .json({ success: false, message: "Parent content not found." });
    }
    // create a new course in the database
    const content_added = await prisma.content.create({
      data: {
        type,
        title,
        hidden,
        description,
        thumbnail,
        parent: { connect: { id: parseInt(parentId) } }, // i am creating the parent node
        notionMetadataId: parseInt(notionMetadataId),
      },
      include: {
        children: true, // Include the children of the newly created content
      },
    });
    console.log("content added successfully in frontend");

    // create a field in the coursecontent
    // const course_added = await prisma.courseContent.create({
    //   data: {
    //     content: {
    //       connect: {
    //         id: content_added.id, // Connect using appxCourseId
    //       },
    //     },
    //     course: { connect: { id: notionMetadataId } },
    //   },
    // });
    return res.status(200).json({
      success: true,
      data: { content_added },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Error logging in:", error);
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
    const getContent = await redisClient.get("getallcontent");
    if (getContent) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(getContent),
      });
    }
    // get all the courses from database

    const allcontents = await prisma.content.findMany();
    if (!allcontents) {
      return res.status(400).json({
        success: false,
      });
    }
    await redisClient.set("getallcontent", JSON.stringify(allcontents));

    return res.status(200).json({
      success: true,
      data: allcontents,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
// export const CourseContent = async (
//   req: {
//     session: any;
//   },
//   res: {
//     [x: string]: any;
//     status: (code: number) => any;
//     json: (data: any) => any;
//   }
// ) => {
//   try {
//     const content = await prisma.content.findMany();
//     const temp: any = content.filter((e) => e.parentId);
//     // console.log("Content in coursebaclemdn", content);
//     // console.log("temp parent", temp);

//     // Response with user details
//     const courseContent = await prisma.courseContent.findMany();

//     // console.log("course - content", courseContent);
//     return res.status(200).json({ success: true, courseContent });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
