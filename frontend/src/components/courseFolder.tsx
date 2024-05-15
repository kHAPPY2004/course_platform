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
  } else if (
    contentFolder.state === "hasValue" &&
    contentFolder.contents.length > 0
  ) {
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
        <section className="flex h-screen">
          {/* Stable side */}
          <div
            className={`${
              sidebar ? "w-1/5" : "hidden"
            } bg-gray-600 p-3 font-bold  text-white overflow-y-scroll`}
          >
            <button
              onClick={() => navigate(-1)}
              className="text-white font-bold mt-16 mb-5 space-x-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm flex justify-center py-2 w-full text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
            {contentFolder.contents.map((content: any) => (
              <div className="-mx-2 font-medium" key={content.id}>
                <div
                  className="cursor-pointer h-12 items-center hover:underline flex flex-row justify-between px-2"
                  onClick={(e) => toggleDropdown(e, content.id)}
                >
                  {content.title}
                  {openDropdownId !== content.id && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
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
                      className="w-5 h-5"
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
                          className="flex hover:dark:text-neutral-400 flex-row my-1 text-sm h-12 items-center px-1 space-x-2"
                          key={option.id}
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
                              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                            />
                          </svg>

                          <Link
                            className=""
                            to={`/course/${params.id}/${content.id}/${option.id}`}
                          >
                            {option.title}
                          </Link>
                        </div>
                      ))}
                    {contentVideo.contents.length < 1 && (
                      <div>No Video ....</div>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {/* Scrollable side */}
          <div
            className={`${
              sidebar ? "w-4/5" : "w-full"
            } overflow-y-auto bg-slate-500`}
          >
            <div className="pt-14">
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
