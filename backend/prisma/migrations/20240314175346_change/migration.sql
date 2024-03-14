-- DropForeignKey
ALTER TABLE "UserPurchases" DROP CONSTRAINT "UserPurchases_courseId_fkey";

-- AddForeignKey
ALTER TABLE "UserPurchases" ADD CONSTRAINT "UserPurchases_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
