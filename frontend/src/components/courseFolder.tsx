import { Link, useParams } from "react-router-dom";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { sidebarOpen } from "../store/atoms/sidebar";
import { useEffect, useState } from "react";
import { filteredContentfolder } from "../store/atoms/getcontent";
import CourseSlugRedirector from "./course_protect";
import React from "react";

interface CourseSlugRedirectorProps1 {
  params: { id: string; hash: string; hash2: string };
  children: React.ReactNode;
}
const CourseSlugViewer: React.FC<CourseSlugRedirectorProps1> = ({
  params,
  children,
}: any) => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useRecoilState(sidebarOpen);
  useEffect(() => {
    if (window.innerWidth < 500) {
      setSidebar(false);
    }
  }, []);
  const goBack = () => {
    navigate(-1);
  };
  const contentFolder = useRecoilValueLoadable(filteredContentfolder);
  console.log("Content Folder in sidebar12313 ", contentFolder);
  if (contentFolder.state === "loading") {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  } else if (contentFolder.state === "hasError") {
    return (
      <>
        <div>Error while fetching data from backend111</div>
      </>
    );
  } else if (
    contentFolder.state === "hasValue" &&
    contentFolder.contents.length > 0
  ) {
    return (
      <>
        <Navbar />
        <section className="flex h-screen">
          {/* Stable side */}
          <div
            className={`${
              sidebar ? "w-1/6" : "hidden"
            } bg-gray-600 p-4  pl-3 font-bold  text-white`}
          >
            <button
              onClick={goBack}
              className="text-white font-bold mt-20 space-x-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm flex justify-center py-2 w-full text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
              <p className="">Go Back</p>
            </button>
            <Link className="flex mt-10 text-blue-300" to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
              <div className="ml-4">Homew</div>
            </Link>
            <Link className="flex mt-10 text-blue-300" to="/new-courses">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
              </svg>
              <div className="ml-4">Courses</div>
            </Link>
          </div>
          {/* Scrollable side */}
          <div
            className={`${
              sidebar ? "w-5/6" : "w-full"
            } overflow-y-auto bg-slate-500`}
          >
            <div className="pt-14">
              {React.cloneElement(children, {
                contentFolder: contentFolder,
                params: params,
              })}
            </div>
          </div>
        </section>
      </>
    );
  }
};
const CourseFolder: React.FC = ({ children }: any) => {
  const [see, setSee] = useState(false);
  const params: any = useParams();
  return (
    <>
      <CourseSlugRedirector setSee={setSee} params={params} />
      {see && <CourseSlugViewer params={params}>{children}</CourseSlugViewer>}
    </>
  );
};

export default CourseFolder;
