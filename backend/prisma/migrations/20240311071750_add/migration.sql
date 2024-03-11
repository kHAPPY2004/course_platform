/*
  Warnings:

  - A unique constraint covering the columns `[appxCourseId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Course_appxCourseId_key" ON "Course"("appxCourseId");
