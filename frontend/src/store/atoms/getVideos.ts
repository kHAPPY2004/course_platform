import { atom, selector } from "recoil";
import axios from "axios";
import { contentSlug } from "./getcontent";

export const videoState = atom({
  key: "videoState",
  default: selector({
    key: "videoState/Default",
    get: async () => {
      const res = await axios.get("/api/get-videos", {
        withCredentials: true,
      });
      console.log("all videos from :f", res);
      return res.data;
    },
  }),
});

export const filteredVideostate = selector({
  key: "filteredVideostate",
  get: ({ get }: any) => {
    const slug = get(contentSlug); // Get the slug from another atom or selector
    const vidoes = get(videoState);
    return (
      vidoes.success &&
      vidoes.data.filter(
        (video: { contentId: any }) => video.contentId === parseInt(slug.hash2)
      )
    );
  },
} as any);

// interface UserData {
//   appxCourseId: number;
//   description: string;
//   discordRoleId: string;
//   imageUrl: string;
//   slug: string;
//   title: string;
//   id: number;
//   sellingPrice: number;
//   listPrice: number;
// }

// export default UserData;
