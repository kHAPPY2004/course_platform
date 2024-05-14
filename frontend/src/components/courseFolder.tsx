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
  contentSlug,
  filteredContentfolder,
  filteredContentvideo,
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

  const contentVideo = useRecoilValueLoadable(filteredContentvideo);
  console.log("Content video in sideBar12312", contentVideo);

  const setSlug = useSetRecoilState(contentSlug);

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
    const HashSet = async (e: { preventDefault: () => void }, id: string) => {
      e.preventDefault();
      setSlug((prevState) => ({
        ...prevState,
        hash: id,
      }));
    };
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
            {contentFolder.contents.map((content: any) => (
              <div key={content.id}>
                <div>{content.id}</div>
                <div
                  className="cursor-pointer"
                  onClick={(e) => HashSet(e, content.id)}
                >
                  {content.title}
                </div>
                {contentVideo && (
                  <div className="max-w-screen-xl justify-between mx-auto p-4 grid grid-cols-1 gap-5 md:grid-cols-3">
                    {contentVideo.contents.map((contentvid: any) => (
                      <div key={contentvid.id}>
                        <div className="bg-red-100">{contentvid.id}</div>

                        {/* Add more details if needed */}
                        <Link
                          className="bg-blue-400 rounded-md p-2"
                          to={`/course/${params.id}/${content.id}/${contentvid.id}`}
                        >
                          play video
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
                {/* Add more details if needed */}
                <Link
                  className="bg-blue-400 rounded-md p-2"
                  to={`/course/${params.id}/${params.hash}/${content.id}`}
                >
                  play video
                </Link>
              </div>
            ))}
          </div>
          {/* Scrollable side */}
          <div
            className={`${
              sidebar ? "w-5/6" : "w-full"
            } overflow-y-auto bg-slate-500`}
          >
            <div className="pt-14">
              {params.hash && (
                <>
                  {React.cloneElement(children, {
                    contentVideo,
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
  console.log("para,", params);
  console.log("89 ", params.hash);
  return (
    <>
      <CourseSlugRedirector setSee={setSee} params={params} />
      {see && <CourseSlugViewer params={params}>{children}</CourseSlugViewer>}
    </>
  );
};

export default CourseFolder;
