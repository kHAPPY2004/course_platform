import { atom, selector } from "recoil";
import axios from "axios";
import { checkUser } from "./userAuth";
import { filteredContentfolder } from "./getcontent";

// Define an atom for the purchase status
export const purchaseStatus = atom({
  key: "purchaseStatus",
  default: false, // Initial value indicating no purchase
});

export const userPurchases = atom({
  key: "userPurchases",
  default: selector({
    key: "userPurchases/Default",
    get: async ({ get }) => {
      // Depend on the purchaseStatus atom
      get(purchaseStatus);

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
    const user = get(checkUser);
    console.log("user", user);
    console.log("totalPurchasesByUser", totalPurchasesByUser);

    return (
      totalPurchasesByUser.success &&
      totalPurchasesByUser.data.filter(
        (purchase: PurchaseData) => purchase.userId === user.data.user.id
      )
    );
  },
} as any);

// here we filter that ,for specific content slug ,this user is authenticated or not
export const protectRoutePurchases = selector<PurchaseData[]>({
  key: "protectRoutePurchases",
  get: ({ get }: any) => {
    const purchasesByUser = get(filteredUserPurchases);
    console.log(
      "purchasesByUser in 1q",
      purchasesByUser,
      typeof purchasesByUser
    );
    if (!purchasesByUser) {
      return purchasesByUser;
    }
    console.log("hwy");
    const id_for_route = get(filteredContentfolder);
    console.log(
      "contentFolder2121",
      // id_for_route[0].notionMetadataId,
      typeof id_for_route
    );

    const filteredPurchases = purchasesByUser.filter(
      (purchase: PurchaseData) => {
        console.log("1313", purchase.courseId, typeof purchase.courseId);
        return purchase.courseId === id_for_route[0].notionMetadataId;
      }
    );
    console.log(
      "object   filteredPurchases ",
      filteredPurchases.length,
      filteredPurchases
    );

    return filteredPurchases.length > 0;
  },
} as any);
interface PurchaseData {
  courseId: number;
  userId: string;
}
