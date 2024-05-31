import { atom, selector } from "recoil";
import axios from "axios";

export const checkUser = atom({
  key: "checkUser",
  default: selector({
    key: "checkUser/Default",
    get: async () => {
      console.log("request goes to check-auth");
      const res = await axios.get("/api/check-auth", {
        withCredentials: true,
      });
      return res.data;
    },
    set: ({ set }, newValue) => {
      set(checkUser, newValue); // Update the selector value
    },
  }),
});

export const loginPopupState = atom<boolean>({
  key: "loginPopupState",
  default: false,
});

export const signupPopupState = atom<boolean>({
  key: "signupPopupState",
  default: false,
});
