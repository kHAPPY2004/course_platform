import { atom, selector } from "recoil";
import axios from "axios";
import { checkUser } from "./userAuth";

export const userPurchases = atom({
  key: "userPurchases",
  default: selector({
    key: "userPurchases/Default",
    get: async () => {
      console.log("reqewr2343242");
      const res = await axios.get("/api/userPurchases", {
        withCredentials: true,
      });
      return res.data;
    },
  }),
});
// export const purchasesSlug: any = atom({
//   key: "purchaseSlug",
//   default: null,
// });

export const filteredUserPurchases = selector<PurchaseData[]>({
  key: "filteredUserPurchases",
  get: ({ get }: any) => {
    const totalPurchasesByUser = get(userPurchases);
    // const slug = get(purchasesSlug);
    const user = get(checkUser);
    console.log("user", user.data.user.id);
    // console.log("slug", slug);
    console.log("totalPurchasesByUser", totalPurchasesByUser);
    const filteredPurchases = totalPurchasesByUser.data.filter(
      (purchase: PurchaseData) => purchase.userId === user.data.user.id
    );

    return filteredPurchases;
  },
} as any);
interface PurchaseData {
  courseId: number;
  userId: string;
  forEach: string;
}
