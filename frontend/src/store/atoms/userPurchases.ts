import { atom, selector } from "recoil";
import axios from "axios";

export const fetchUserPurchases = atom<PurchaseData[]>({
  key: "fetchUserPurchases",
  default: selector({
    key: "fetchUserPurchases/Default",
    get: async () => {
      try {
        const res = await axios.get("/api/userPurchases", {
          withCredentials: true,
        });
        return res.data.data;
      } catch (error) {
        return [];
      }
    },
    set: ({ set }: any, newValue: any) => {
      if (newValue) set(fetchUserPurchases, newValue);
    },
  }),
});

interface PurchaseData {
  courseId: number;
  userId: string;
}
