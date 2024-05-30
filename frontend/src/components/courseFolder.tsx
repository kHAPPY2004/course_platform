import { Link, useParams } from "react-router-dom";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import {
  useRecoilState,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import { sidebarOpen } from "../store/atoms/sidebar";
import { useEffect, useState } from "react";
import {
  contentSlugSidebar,
  filteredContentfolder,
  filteredContentvideoSidebar,
} from "../store/atoms/getcontent";
import CourseSlugRedirector from "./course_protect";
import React from "react";
import BreadCrumbs from "../components/breadCrumbs";

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
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const contentFolder = useRecoilValueLoadable(filteredContentfolder);
  const contentVideo = useRecoilValueLoadable(filteredContentvideoSidebar);
  const setSlug = useSetRecoilState(contentSlugSidebar);

  useEffect(() => {
    if (window.innerWidth < 500) {
      setSidebar(false);
    }
  }, []);

  // useEffect(() => {
  //   // Reset openDropdownId when route changes
  //   setOpenDropdownId(null);
  // }, [location.pathname]);

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
  } else if (contentFolder.state === "hasValue") {
    const toggleDropdown = async (
      e: { preventDefault: () => void },
      id: string
    ) => {
      e.preventDefault();
      setSlug((prevState) => ({
        ...prevState,
        hash: id,
      }));
      setOpenDropdownId((prevState) => (prevState === id ? null : id));
    };
    return (
      <>
        <Navbar />
        <section className="flex h-screen select-none">
          {/* Stable side */}
          <div
            className={`${
              sidebar ? "w-1/3 md:w-1/4 lg:w-1/4 xl:w-1/5" : "hidden"
            } bg-blue-50 bg-opacity-80 md:p-3 font-medium lg:font-normal pt-16 lg:text-base md:pt-20 p-1 text-xs text-gray-900 dark:text-white overflow-y-scroll dark:bg-gray-900 transform transition duration-500`}
          >
            <button
              onClick={() => navigate(-1)}
              className="text-white md:mb-5 mb-3 md:text-sm md:space-x-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg flex justify-center md:py-2 py-1 w-full text-center dark:bg-blue-900 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 hidden md:block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
              <p>Go Back</p>
            </button>
            {contentFolder.contents.map((content: any) => (
              <div className="-mx-2" key={content.id}>
                <div
                  className="cursor-pointer h-10 md:h-12 items-center hover:underline flex flex-row justify-between px-2"
                  onClick={(e) => toggleDropdown(e, content.id)}
                >
                  <p className="sm:hidden block">
                    {content.title.length > 15
                      ? content.title.substring(0, 15) + "..."
                      : content.title}
                  </p>
                  <p className="sm:block hidden">{content.title}</p>
                  {openDropdownId !== content.id && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3 md:w-5 md:h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {openDropdownId === content.id && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3 md:w-5 md:h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                {openDropdownId === content.id && (
                  <ul>
                    {contentVideo.contents.length > 0 &&
                      contentVideo.contents.map((option: any) => (
                        <div
                          className="flex hover:dark:text-neutral-400 font-light md:text-sm flex-row h-9 md:h-12 items-center px-2 space-x-1 md:space-x-2"
                          key={option.id}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                            />
                          </svg>

                          <Link
                            to={`/course/${params.id}/${content.id}/${option.id}`}
                          >
                            <p className="md:hidden block">
                              {option.title.length > 12
                                ? option.title.substring(0, 12) + "..."
                                : option.title}
                            </p>
                            <p className="md:block hidden lg:hidden">
                              {option.title.length > 20
                                ? option.title.substring(0, 20) + "..."
                                : option.title}
                            </p>
                            <p className="lg:block hidden">
                              {option.title.length > 25
                                ? option.title.substring(0, 25) + "..."
                                : option.title}
                            </p>
                          </Link>
                        </div>
                      ))}
                    {contentVideo.contents.length < 1 && (
                      <div className="px-2">No Video ....</div>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {/* Scrollable side */}
          <div
            className={`${
              sidebar ? "w-2/3 md:w-3/4 lg:w-3/4 xl:w-4/5" : "w-full"
            } overflow-y-auto bg-white dark:bg-gray-950 text-gray-800 dark:text-white`}
          >
            <div className="md:pt-14 pt-10">
              <div className="md:px-4 mb-5">
                <BreadCrumbs />
              </div>
              {params.hash && (
                <>
                  {React.cloneElement(children, {
                    params,
                  })}
                </>
              )}
              {!params.hash && (
                <>
                  {React.cloneElement(children, {
                    contentFolder,
                    params,
                  })}
                </>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }
};
const CourseFolder: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
