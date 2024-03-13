import { atom, selector } from "recoil";
import axios from "axios";

export const courseContent = atom({
  key: "courseContent",
  default: selector({
    key: "courseContent/Default",
    get: async () => {
      const res = await axios.get("/api/courseContent", {
        withCredentials: true,
      });
      return res.data;
    },
  }),
});
