import { atom, selector } from "recoil";
import axios from "axios";

// Define an atom for the purchase status
export const purchaseStatus = atom({
  key: "purchaseStatus",
  default: 0, // Initial value indicating no purchase
});

// Define a selector to get and set the purchase status
export const purchaseStatusSelector = selector({
  key: "purchaseStatusSelector",
  get: ({ get }) => {
    return get(purchaseStatus);
  },
  set: ({ set }, newValue) => {
    console.log("setting new vlaue", newValue);
    if (newValue) set(purchaseStatus, newValue);
  },
});

export const userPurchases = atom({
  key: "userPurchases",
  default: selector({
    key: "userPurchases/Default",
    get: async ({ get }) => {
      // Depend on the purchaseStatus atom
      get(purchaseStatusSelector);

      console.log("Fetching user purchases...");
      const res = await axios.get("/api/userPurchases", {
        withCredentials: true,
      });
      return res.data;
    },
  }),
});

export const filteredUserPurchases = selector<PurchaseData[]>({
  key: "filteredUserPurchases",
  get: ({ get }: any) => {
    const totalPurchasesByUser = get(userPurchases);
    return totalPurchasesByUser.success && totalPurchasesByUser.data;
  },
} as any);

// here we filter that ,for specific content slug ,this user is authenticated or not
// export const protectRoutePurchases = selector<PurchaseData[]>({
//   key: "protectRoutePurchases",
//   get: ({ get }: any) => {
//     const purchasesByUser = get(filteredUserPurchases);
//     console.log("purchasesByUser in 1q", purchasesByUser);

//     if (!purchasesByUser) {
//       return purchasesByUser;
//     }

//     const slug = get(contentSlug);
//     console.log("slug", slug);

//     const filteredPurchases =
//       purchasesByUser.length > 0 &&
//       purchasesByUser.filter((purchase: PurchaseData) => {
//         console.log("1313", purchase.courseId, typeof purchase.courseId);
//         return purchase.courseId === parseInt(slug.id);
//       });

//     console.log(
//       "object   filteredPurchases ",
//       filteredPurchases.length,
//       filteredPurchases
//     );

//     return filteredPurchases.length > 0;
//   },
// } as any);
interface PurchaseData {
  courseId: number;
  userId: string;
}
