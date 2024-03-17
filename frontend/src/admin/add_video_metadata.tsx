import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Add_Video_Metadata: React.FC = () => {
  const navigate = useNavigate();

  interface CourseState {
    adminSecret: string;
    video_360p_1: string;
    video_720p_1: string;
    video_1080p_1: string;
    contentId: number;
  }

  const initialCourseState: CourseState = {
    adminSecret: "",
    video_360p_1: "", // Provide default values if needed
    video_720p_1: "",
    video_1080p_1: "",
    contentId: 0,
  };

  const [addCourse, setAddCourse] = useState<CourseState>(initialCourseState);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "video_360p_1") {
      setAddCourse((prevState) => ({
        ...prevState,
        video_360p_1: value,
      }));
    } else if (name === "video_720p_1") {
      setAddCourse((prevState) => ({
        ...prevState,
        video_720p_1: value,
      }));
    } else if (name === "video_1080p_1") {
      setAddCourse((prevState) => ({
        ...prevState,
        video_1080p_1: value,
      }));
    } else if (name === "contentId") {
      setAddCourse((prevState) => ({
        ...prevState,
        contentId: parseInt(value),
      }));
    } else if (name === "adminSecret") {
      setAddCourse((prevState) => ({
        ...prevState,
        adminSecret: value,
      }));
    }
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/add-video-metadata", {
        ...addCourse,
      });
      console.log("res in frontend after adding new-course", res);
      if (!res.data.success) {
        console.log(`${res.data.message}`);
        toast.warn(`${res.data.message}`, {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        navigate("/");
      } else {
        console.log("toast for 200");
        toast.success(" Your account has been created! ", {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        // after request, clean the fields
        setAddCourse({
          adminSecret: "",
          video_360p_1: "", // Provide default values if needed
          video_720p_1: "",
          video_1080p_1: "",
          contentId: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  return (
    <section className="text-gray-600">
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
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an content
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-6"
              method="POST"
            >
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  adminSecret
                </label>
                <input
                  value={addCourse.adminSecret}
                  onChange={handleChange}
                  type="text"
                  name="adminSecret"
                  id="adminSecret"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="admin secret"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  video_360p_1
                </label>
                <input
                  value={addCourse.video_360p_1}
                  onChange={handleChange}
                  type="text"
                  name="video_360p_1"
                  id="video_360p_1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="video_360p_1"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  video_720p_1
                </label>
                <input
                  value={addCourse.video_720p_1}
                  onChange={handleChange}
                  type="text"
                  name="video_720p_1"
                  id="video_720p_1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="video_720p_1"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  video_1080p_1
                </label>
                <input
                  value={addCourse.video_1080p_1}
                  onChange={handleChange}
                  type="text"
                  name="video_1080p_1"
                  id="video_1080p_1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="video_1080p_1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  contentId
                </label>
                <input
                  value={addCourse.contentId}
                  onChange={handleChange}
                  type="number"
                  name="contentId"
                  id="contentId"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="contentId"
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-gray-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-gray-600 hover:underline dark:text-gray-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Add Course
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                {/* <Link
          to="/login"
          className="font-medium text-gray-600 hover:underline dark:text-gray-500"
        >
          Login here
        </Link> */}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Add_Video_Metadata;
