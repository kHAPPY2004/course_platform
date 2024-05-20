import { atom, selector } from "recoil";
import axios from "axios";
import { coursesState } from "./getcourses";
import { checkUser } from "./userAuth";

export const fetchUserPurchases = atom<PurchaseData[]>({
  key: "fetchUserPurchases",
  default: selector({
    key: "fetchUserPurchases/Default",
    get: async ({ get }: any) => {
      try {
        const isUserExits = get(checkUser);
        if (isUserExits.success) {
          const res = await axios.get("/api/userPurchases", {
            withCredentials: true,
          });
          return res.data.data;
        } else {
          return [];
        }
      } catch (error) {
        return [];
      }
    },
    set: ({ set }: any, newValue: any) => {
      if (newValue) set(fetchUserPurchases, newValue);
    },
  }),
});

export const myPurchaseContent = selector<PurchaseData[]>({
  key: "myPurchaseContent",
  get: ({ get }: any) => {
    const purchase = get(fetchUserPurchases);
    const course_state = get(coursesState);
    if (purchase.length > 0) {
      // Extract courseIds from purchases
      const purchasedCourseIds = purchase.map(
        (purcha: { courseId: any }) => purcha.courseId
      );

      // Filter courses based on the purchased courseIds
      const filteredCourses = course_state.success
        ? course_state.data.filter((course: { appxCourseId: any }) =>
            purchasedCourseIds.includes(course.appxCourseId)
          )
        : [];

      return filteredCourses;
    } else {
      return [];
    }
  },
} as any);

interface PurchaseData {
  courseId: number;
  userId: string;
}
