import { atom, selector } from "recoil";
import axios from "axios";

export const userPurchases = atom({
  key: "userPurchases",
  default: selector({
    key: "userPurchases/Default",
    get: async () => {
      console.log("reqewr2343242");
      const res = await axios.get("/api/userPurchases", {
        withCredentials: true,
      });
      return res;
    },
  }),
});
