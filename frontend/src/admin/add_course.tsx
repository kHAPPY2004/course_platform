import React, { useState } from "react";
// import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const Add_Course: React.FC = () => {
  const navigate = useNavigate();

  interface CourseState {
    adminSecret: string;
    title: string;
    description: string;
    imageUrl: string;
    slug: string;
    appxCourseId: number;
    discordRoleId: string;
    sellingPrice: string;
    listPrice: string;
  }

  const initialCourseState: CourseState = {
    adminSecret: "", // Provide default values if needed
    title: "",
    description: "",
    imageUrl: "",
    slug: "",
    appxCourseId: 0,
    discordRoleId: "",
    sellingPrice: "",
    listPrice: "",
  };

  const [addCourse, setAddCourse] = useState<CourseState>(initialCourseState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title") {
      setAddCourse((prevState) => ({
        ...prevState,
        title: value,
      }));
    } else if (name === "description") {
      setAddCourse((prevState) => ({
        ...prevState,
        description: value,
      }));
    } else if (name === "imageUrl") {
      setAddCourse((prevState) => ({
        ...prevState,
        imageUrl: value,
      }));
    } else if (name === "slug") {
      setAddCourse((prevState) => ({
        ...prevState,
        slug: value,
      }));
    } else if (name === "appxCourseId") {
      setAddCourse((prevState) => ({
        ...prevState,
        appxCourseId: parseInt(value),
      }));
    } else if (name === "discordRoleId") {
      setAddCourse((prevState) => ({
        ...prevState,
        discordRoleId: value,
      }));
    } else if (name === "adminSecret") {
      setAddCourse((prevState) => ({
        ...prevState,
        adminSecret: value,
      }));
    } else if (name === "sellingPrice") {
      setAddCourse((prevState) => ({
        ...prevState,
        sellingPrice: value,
      }));
    } else if (name === "listPrice") {
      setAddCourse((prevState) => ({
        ...prevState,
        listPrice: value,
      }));
    }
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/new-courses", {
        ...addCourse,
      });
      console.log("res in frontend after adding new-course", res);
      if (!res.data.success) {
        console.log("you are not admin");
        toast.success("you are not admin", {
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
          adminSecret: "", // Reset to empty string
          title: "", // Reset to empty string
          description: "", // Reset to empty string
          imageUrl: "", // Reset to empty string
          slug: "", // Reset to empty string
          appxCourseId: 0, // Reset to default value, adjust if it's a different default value
          discordRoleId: "", // Reset to empty string
          sellingPrice: "",
          listPrice: "",
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
        {/* <Link
          to="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-10 h-8 mr-2"
            src="/codeswearcircle.png"
            alt="logo"
          />
          codeswear.com
        </Link> */}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
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
                  Title
                </label>
                <input
                  value={addCourse.title}
                  onChange={handleChange}
                  type="text"
                  name="title"
                  id="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Course Title"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <input
                  value={addCourse.description}
                  onChange={handleChange}
                  type="text"
                  name="description"
                  id="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Course Description"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="imageUrl"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Image Url
                </label>
                <input
                  value={addCourse.imageUrl}
                  onChange={handleChange}
                  type="text"
                  name="imageUrl"
                  id="imageUrl"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Image URL"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="slug"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Slug
                </label>
                <input
                  value={addCourse.slug}
                  onChange={handleChange}
                  type="text"
                  name="slug"
                  id="slug"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Course Slug"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="appxCourseId"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Appx Course Id
                </label>
                <input
                  value={addCourse.appxCourseId}
                  onChange={handleChange}
                  type="number"
                  name="appxCourseId"
                  id="appxCourseId"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Appx Course Id"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="sellingPrice"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Selling Price
                </label>
                <input
                  value={addCourse.sellingPrice}
                  onChange={handleChange}
                  type="text"
                  name="sellingPrice"
                  id="sellingPrice"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter sellingPrice"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="listPrice"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  List Price
                </label>
                <input
                  value={addCourse.listPrice}
                  onChange={handleChange}
                  type="text"
                  name="listPrice"
                  id="listPrice"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter listPrice"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="discordRoleId"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Discord Role Id
                </label>
                <input
                  value={addCourse.discordRoleId}
                  onChange={handleChange}
                  type="text"
                  name="discordRoleId"
                  id="discordRoleId"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Discord Role Id"
                  required
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

export default Add_Course;
