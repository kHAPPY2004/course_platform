import prisma from "../src/DB/db.config";
async function main() {
  try {
    // Ensure Prisma client is connected
    await prisma.$connect();

    // Check if any courses exist in the database
    const doCoursesExist = await prisma.course.count();
    if (doCoursesExist) {
      console.error("Prisma is already seeded with courses.");
      return;
    }

    // Sample course data to be seeded
    const coursesData = [
      {
        appxCourseId: 1,
        discordRoleId: "discord role id",
        title: "Live 0-100 Complete",
        imageUrl:
          "https://appx-wsb.kaxa.in/teachcode/admin/COURSE/cover/1699610005757WhatsApp-Image-2023-11-10-at-3.16.18-PM.jpeg",
        description: "test course 1 description ...",
        openToEveryone: false,
        slug: "8-live-0-100-complete",
        sellingPrice: 4999,
        listPrice: 7999,
      },
      {
        appxCourseId: 2,
        discordRoleId: "discord role id",
        title: "Live 0-1",
        imageUrl:
          "https://appx-wsb.kaxa.in/teachcode/admin/COURSE/cover/1699610063563WhatsApp-Image-2023-11-08-at-8.31.14-PM.jpeg",
        description: "test course 2 description ...",
        openToEveryone: false,
        slug: "6-live-0-1",
        sellingPrice: 3499,
        listPrice: 5999,
      },
      {
        appxCourseId: 3,
        discordRoleId: "discord role id",
        title: "Live 1-100",
        imageUrl:
          "https://appx-wsb.kaxa.in/teachcode/admin/COURSE/cover/1699610081268WhatsApp-Image-2023-11-08-at-8.31.13-PM.jpeg",
        description: "test course 2 description ...",
        openToEveryone: false,
        slug: "7-live-1-100",
        sellingPrice: 3999,
        listPrice: 5999,
      },
    ];
    const contentDataFolder = [
      {
        type: "folder",
        title: "Week -0 course 0-100",
        hidden: false,
        description: "description for week -0",
        thumbnail:
          "https://d2szwvl7yo497w.cloudfront.net/courseThumbnails/folder.png",
        notionMetadataId: 1,
      },
      {
        type: "folder",
        title: "Week -1 course 0-100",
        hidden: false,
        description: "description for week -1",
        thumbnail:
          "https://d2szwvl7yo497w.cloudfront.net/courseThumbnails/folder.png",
        notionMetadataId: 1,
      },
      {
        type: "folder",
        title: "Week -2 course 0-100",
        hidden: false,
        description: "description for week -2",
        thumbnail:
          "https://d2szwvl7yo497w.cloudfront.net/courseThumbnails/folder.png",
        notionMetadataId: 1,
      },
      {
        type: "folder",
        title: "Week -3 course 0-100",
        hidden: false,
        description: "description for week -3",
        thumbnail:
          "https://d2szwvl7yo497w.cloudfront.net/courseThumbnails/folder.png",
        notionMetadataId: 1,
      },
      {
        type: "folder",
        title: "Week -4 course 0-100",
        hidden: false,
        description: "description for week - 4",
        thumbnail:
          "https://d2szwvl7yo497w.cloudfront.net/courseThumbnails/folder.png",
        notionMetadataId: 1,
      },
    ];
    const contentDataVideo = [
      {
        type: "video",
        title: "Week -0 Intro, Setting up your IDE",
        hidden: false,
        description: "description for week -0",
        thumbnail:
          "https://d2szwvl7yo497w.cloudfront.net/courseThumbnails/video.png",
        parentId: 1,
        notionMetadataId: 1,
      },
      {
        type: "video",
        title: "Week -0 HTML Basics (Tags and Attributes)",
        hidden: false,
        description: "description for week -0",
        thumbnail:
          "https://d2szwvl7yo497w.cloudfront.net/courseThumbnails/video.png",
        parentId: 1,
        notionMetadataId: 1,
      },
      {
        type: "video",
        title: "Week -0 CSS Basic 0",
        hidden: false,
        description: "description for week -0",
        thumbnail:
          "https://d2szwvl7yo497w.cloudfront.net/courseThumbnails/video.png",
        parentId: 1,
        notionMetadataId: 1,
      },
      {
        type: "video",
        title: "Week -0 CSS Basic 1",
        hidden: false,
        description: "description for week -0",
        thumbnail:
          "https://d2szwvl7yo497w.cloudfront.net/courseThumbnails/video.png",
        parentId: 1,
        notionMetadataId: 1,
      },
      {
        type: "video",
        title: "Week -0 CSS Basic 2",
        hidden: false,
        description: "description for week -0",
        thumbnail:
          "https://d2szwvl7yo497w.cloudfront.net/courseThumbnails/video.png",
        parentId: 1,
        notionMetadataId: 1,
      },
    ];

    // Seed courses data
    await prisma.course.createMany({ data: coursesData });
    await prisma.content.createMany({ data: contentDataFolder });
    await prisma.content.createMany({ data: contentDataVideo });
    await prisma.courseContent.create({
      data: {
        courseId: 1,
        contentId: 1,
      },
    });
    await prisma.user.create({
      data: {
        name: "Demo",
        email: "demo@gmail.com",
        password: "U2FsdGVkX19HrxoSS3zHl5SSQ3OywtloRU+OJZ3QQG4=",
        phoneNumber: "234234256",
      },
    });

    console.log("Prisma database has been seeded successfully.");
  } catch (error) {
    console.error("Error occurred during seeding:", error);
  } finally {
    // Disconnect Prisma client after seeding, regardless of success or failure
    await prisma.$disconnect();
  }
}

// Call the main function to start the seeding process
main();
