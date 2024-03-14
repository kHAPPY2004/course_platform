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
    const user = get(checkUser);
    console.log("user", user);
    console.log("totalPurchasesByUser", totalPurchasesByUser);
    if (totalPurchasesByUser.success) {
      const filteredPurchases = totalPurchasesByUser.data.filter(
        (purchase: PurchaseData) => purchase.userId === user.data.user.id
      );
      return filteredPurchases;
    } else return totalPurchasesByUser.message;
  },
} as any);

// export const protectRouteSlug = atom<string | null>({
//   key: "protectRouteSlug",
//   default: null,
// });

// export const protectRoutePurchases = selector<PurchaseData[]>({
//   key: "protectRoutePurchases",
//   get: ({ get }: any) => {
//     const purchasesByUser = get(filteredUserPurchases);
//     console.log("purchasesByUser", purchasesByUser);

//     const slug = get(protectRouteSlug);
//     console.log("slug", typeof slug, slug);
//     // const filteredPurchases = purchasesByUser.data.filter(
//     //   (purchase: PurchaseData) => purchase.userId === slug
//     // );

//     // return filteredPurchases;
//     return purchasesByUser;
//   },
// } as any);
interface PurchaseData {
  courseId: number;
  userId: string;
  forEach: string;
}
