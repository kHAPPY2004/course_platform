import { Link, useParams } from "react-router-dom";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { filteredCoursesState } from "../store/atoms/getcourses";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchUserPurchases } from "../store/atoms/userPurchases";
import { contentSlug } from "../store/atoms/getcontent";
import ToastConfig from "../util/toastcontainer";
import { showToast } from "../util/toast";
import usePopupState from "../components/popupState";
import { LoginModal } from "../util/reuse_component/signupandloginmodel";
import { checkUser } from "../store/atoms/userAuth";
interface PurchaseButtonProps {
  handleSubmit: any;
  id: any;
  course: any;
}

export const New_Courses_slug: React.FC = () => {
  const params: any = useParams();
  const navigate = useNavigate();
  const { showLogin, openLogin } = usePopupState();
  const setSlug = useSetRecoilState(contentSlug);
  const course = useRecoilValueLoadable(filteredCoursesState);
  const setUserPurchases = useSetRecoilState(fetchUserPurchases);
  const check_user = useRecoilValueLoadable(checkUser);
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
          showToast("warn", res.data.message);
          navigate("/");
        } else {
          showToast("success", res.data.message);
          setUserPurchases((prevPurchases) => [
            ...prevPurchases,
            ...res.data.data,
          ]);
        }
      } catch (error) {
        showToast("error", "Error fetching user data:");
      }
    };
    return (
      <>
        <ToastConfig />
        {showLogin && <LoginModal />}

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
        {check_user.state === "hasValue" && check_user.contents.success && (
          <PurchaseButton
            handleSubmit={handleSubmit}
            id={course.contents[0].id}
            course={course}
          />
        )}
        {check_user.state === "hasValue" && !check_user.contents.success && (
          <button
            className="bg-blue-400 rounded-md p-1 m-1 px-3"
            onClick={() => {
              openLogin();
            }}
          >
            Buy Now
          </button>
        )}
      </>
    );
  } else {
    return <div>No course found for the provided slug</div>;
  }
};

const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  handleSubmit,
  id,
  course,
}: any) => {
  const check_user_purchases = useRecoilValueLoadable(fetchUserPurchases);
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
    const data = Object.values(check_user_purchases.contents || []);
    const filteredPurchases = data.filter(
      (purchase: any) => purchase.courseId === course.contents[0].id
    );

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
