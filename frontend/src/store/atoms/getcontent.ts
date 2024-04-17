import { atom, selector } from "recoil";
import axios from "axios";
import { courseContent } from "./courseContent";

export const contentSlug = atom<ContentSlug>({
  key: "contentSlug",
  default: { id: null, hash: null, hash2: null }, // Set default values for both id and hash
});
export interface ContentSlug {
  id: string | null;
  hash: string | null;
  hash2: string | null;
}

export const contentState = atom<UserData[]>({
  key: "contentState",
  default: selector({
    key: "contentState/Default",
    get: async () => {
      console.log("Hello this is contentState");
      const res = await axios.get("/api/getContentfolder", {
        withCredentials: true,
      });
      console.log("res", res);
      return res.data;
    },
  }),
});

export const filteredContentfolder = selector<UserData[]>({
  key: "filteredContentfolder",
  get: ({ get }: any) => {
    // const coursecontentqw = get(courseContent); // Get the slug from another atom or selector
    // console.log("coursecontent123", coursecontentqw.courseContent[0].courseId);
    const courses = get(contentState);
    const slug = get(contentSlug); // Get the slug from another atom or selector
    console.log("Slugi 4", typeof slug, slug);

    return (
      courses.success &&
      courses.data.filter(
        (course: { type: any; notionMetadataId: any }) =>
          course.type === "folder" &&
          course.notionMetadataId === parseInt(slug.id)
      )
    );
  },
} as any);

export const filteredContentvideo = selector<UserData[]>({
  key: "filteredContentvideo",
  get: ({ get }: any) => {
    const slug = get(contentSlug); // Get the slug from another atom or selector
    const courses = get(contentState);
    console.log("slug in filter", slug);
    console.log(courses);
    return (
      courses.success &&
      courses.data.filter(
        (content: { type: any; parentId: any }) =>
          content.type === "video" && content.parentId === parseInt(slug.hash)
      )
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
