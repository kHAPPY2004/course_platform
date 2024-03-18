import { Link, useParams } from "react-router-dom";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { filteredCoursesState } from "../store/atoms/getcourses";
import { useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  filteredUserPurchases,
  purchaseStatusSelector,
} from "../store/atoms/userPurchases";
import { contentSlug } from "../store/atoms/getcontent";

export const New_Courses_slug: React.FC = () => {
  const params: any = useParams();
  console.log("Params u", params);
  const navigate = useNavigate();

  const setSlug = useSetRecoilState(contentSlug);
  const course = useRecoilValueLoadable(filteredCoursesState);
  const setPurchases = useSetRecoilState(purchaseStatusSelector);

  useEffect(() => {
    setSlug({ id: params.id, hash: params.hash, hash2: params.hash2 }); // Set both slug values in one useEffect
  }, [params.id, params.hash, params.hash2, setSlug]);

  if (course.state === "loading") {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  } else if (course.state === "hasError") {
    return (
      <>
        <div>Error while fetching data from backend</div>
      </>
    );
  } else if (course.state === "hasValue" && course.contents.length > 0) {
    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      try {
        const res = await axios.post("/api/course-purchase", {
          id: course.contents[0].id,
        });

        if (!res.data.success) {
          toast.success("You are not Authorized", {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          navigate("/login");
        } else {
          // Update the purchase status to trigger a re-fetch of userPurchases
          console.log(res.data);
          setPurchases(res.data.course_added.courseId);
          toast.success("course purchased successfully...", {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data:", {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    };
    return (
      <>
        {" "}
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {/* <div>slug: {slug.id}</div> */}
        <div>id: {course.contents[0].id}</div>
        <div>appxCourseId: {course.contents[0].appxCourseId}</div>
        <div>{course.contents[0].description}</div>
        <div>{course.contents[0].discordRoleId}</div>
        <div>{course.contents[0].id}</div>
        <div>{course.contents[0].imageUrl}</div>
        <div className="text-green-300">
          {(
            ((course.contents[0].listPrice - course.contents[0].sellingPrice) /
              course.contents[0].listPrice) *
            100
          ).toFixed(2)}
          {" % off"}
        </div>
        <div>{course.contents[0].slug}</div>
        <PurchaseButton
          handleSubmit={handleSubmit}
          id={course.contents[0].id}
          course={course}
        />
      </>
    );
  } else {
    return <div>No course found for the provided slug</div>;
  }
};
interface PurchaseButtonProps {
  handleSubmit: any;
  id: any;
  course: any;
}
const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  handleSubmit,
  id,
  course,
}: any) => {
  const check_user_purchases = useRecoilValueLoadable(filteredUserPurchases);

  const data = Object.values(check_user_purchases.contents);
  const filteredPurchases = data.filter(
    (purchase: any) => purchase.courseId === course.contents[0].id
  );

  if (check_user_purchases.state === "loading") {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  } else if (check_user_purchases.state === "hasError") {
    return (
      <>
        <div>Error while fetching data from backend</div>
      </>
    );
  } else if (check_user_purchases.state === "hasValue") {
    return (
      <div>
        {filteredPurchases.length == 0 && (
          <button
            onClick={handleSubmit}
            className="bg-blue-400 rounded-md p-1 m-1 px-3"
          >
            Buy Now
          </button>
        )}
        {filteredPurchases.length > 0 && (
          <Link className="bg-blue-400 rounded-md p-2" to={`/course/${id}`}>
            View Details
          </Link>
        )}
      </div>
    );
  }
};
