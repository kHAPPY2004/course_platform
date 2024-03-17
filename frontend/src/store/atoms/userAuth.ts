import { atom, selector } from "recoil";
import axios from "axios";

export const checkUser = atom({
  key: "checkUser",
  default: selector({
    key: "checkUser/Default",
    get: async () => {
      const res = await axios.get("/api/check-auth", {
        withCredentials: true,
      });
      return res;
    },
    set: ({ set }, newValue) => {
      set(checkUser, newValue); // Update the selector value
    },
  }),
});
