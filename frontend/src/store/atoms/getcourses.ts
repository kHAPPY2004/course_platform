import { atom, selector } from "recoil";
import axios from "axios";

export const coursesState = atom<UserData[]>({
  key: "coursesState",
  default: selector({
    key: "UserInfo/Default",
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
    const courses = get(coursesState);
    return courses.filter((course: { slug: any }) => course.slug === slug);
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
