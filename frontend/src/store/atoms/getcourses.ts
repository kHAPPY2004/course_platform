import { atom, selector } from "recoil";
import axios from "axios";
import { contentSlug } from "./getcontent";

export const coursesState = atom({
  key: "coursesState",
  default: selector({
    key: "coursesState/Default",
    get: async () => {
      const res = await axios.get("/api/new-courses", {
        withCredentials: true,
      });
      return res.data;
    },
  }),
});

export const filteredCoursesState = selector<UserData[]>({
  key: "filteredCoursesState",
  get: ({ get }: any) => {
    const slug = get(contentSlug); // Get the slug from another atom or selector
    console.log("Slugi", typeof slug, slug);
    const courses = get(coursesState);
    console.log("course filtererererstate", courses);
    return (
      courses.success &&
      courses.new_courses.filter(
        (course: { id: any }) => course.id === parseInt(slug.id)
      )
    );
  },
} as any);

interface UserData {
  appxCourseId: number;
  description: string;
  discordRoleId: string;
  imageUrl: string;
  slug: string;
  title: string;
  id: number;
  sellingPrice: number;
  listPrice: number;
}

export default UserData;
