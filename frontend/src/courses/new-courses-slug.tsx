import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { filteredCoursesState, slugState } from "../store/atoms/getcourses";
import { useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
export const New_Courses_slug: React.FC = () => {
  const navigate = useNavigate();
  const [slug, setSlug] = useRecoilState(slugState); // Get and set the current slug
  const params: any = useParams();
  // update the slug
  useEffect(() => {
    return setSlug(params.id);
  }, [params.id, setSlug]);
  const course = useRecoilValueLoadable(filteredCoursesState);
  console.log(course);
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
          courseId: course.contents[0].appxCourseId,
        });
        console.log("res in frontend", res);
        if (res.data.success == "false") {
          console.log("You are not Authorized");
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
          console.log("toast for 200");
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
        <div>slug: {slug}</div>
        <div>{course.contents[0].id}</div>
        <div>{course.contents[0].appxCourseId}</div>
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
        <button
          onClick={handleSubmit}
          className="bg-blue-400 rounded-md p-1 m-1 px-3"
        >
          Buy Now
        </button>
      </>
    );
  } else {
    return <div>No course found for the provided slug</div>;
  }
};
// };
