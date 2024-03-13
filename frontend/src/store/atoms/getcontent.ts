import { atom, selector } from "recoil";
import axios from "axios";
import { courseContent } from "./courseContent";
import { slugState } from "./getcourses";

export const contentState = atom<UserData[]>({
  key: "contentState",
  default: selector({
    key: "contentState/Default",
    get: async () => {
      const res = await axios.get("/api/getContentfolder", {
        withCredentials: true,
      });
      return res.data.allcontents;
    },
  }),
});
export const contentSlug1 = atom<string | null>({
  key: "contentSlug1",
  default: null,
});

export const filteredContentfolder = selector<UserData[]>({
  key: "filteredContentfolder",
  get: ({ get }: any) => {
    const coursecontentqw = get(courseContent); // Get the slug from another atom or selector
    console.log("coursecontent123", coursecontentqw.courseContent[0].courseId);
    const courses = get(contentState);

    const slug = get(contentSlug1); // Get the slug from another atom or selector
    console.log("Slugi 4", typeof slug, slug);

    return courses.filter(
      (course: { type: any; notionMetadataId: any }) =>
        course.type === "folder" && course.notionMetadataId === parseInt(slug)
    );
  },
} as any);

export const contentSlug = atom<string | null>({
  key: "contentSlug",
  default: null,
});

export const filteredContentvideo = selector<UserData[]>({
  key: "filteredContentvideo",
  get: ({ get }: any) => {
    const slug = get(contentSlug); // Get the slug from another atom or selector
    const courses = get(contentState);
    console.log("slug in filter", slug);
    console.log(courses);
    return courses.filter(
      (content: { type: any; parentId: any }) =>
        content.type === "video" && content.parentId === parseInt(slug)
    );
  },
} as any);

interface UserData {
  adminSecret: string;
  title: string;
  description: string;
  type: string;
  hidden: boolean;
  thumbnail: string;
  parentId: number;
  notionMetadataId: number;
  id: number;
}

export default UserData;
