import { atom, selector } from "recoil";
import axios from "axios";

export const coursesState = atom<UserData[]>({
  key: "coursesState",
  default: selector({
    key: "coursesState/Default",
    get: async () => {
      const res = await axios.get("/api/new-courses", {
        withCredentials: true,
      });
      return res.data.new_courses;
    },
  }),
});
export const slugState = atom<string | null>({
  key: "slugState",
  default: null,
});

export const filteredCoursesState = selector<UserData[]>({
  key: "filteredCoursesState",
  get: ({ get }: any) => {
    const slug = get(slugState); // Get the slug from another atom or selector
    console.log("Slugi", typeof slug, slug);
    const courses = get(coursesState);
    console.log("course filtererererstate", courses);
    return courses.filter(
      (course: { id: any }) => course.id === parseInt(slug)
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
