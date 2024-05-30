import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { filteredContentvideo } from "../store/atoms/getcontent";
import CourseSlugRedirector from "../components/course_protect";

interface CourseSlugRedirectorProps1 {
  params: { id: string; hash: string; hash2: string };
}

const CourseSlugViewer: React.FC<CourseSlugRedirectorProps1> = ({ params }) => {
  const contentVideo = useRecoilValueLoadable(filteredContentvideo);
  if (contentVideo.state === "loading") {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  } else if (contentVideo.state === "hasError") {
    return (
      <>
        <div>Error while fetching data from backend</div>
      </>
    );
  } else if (
    contentVideo.state === "hasValue" &&
    contentVideo.contents.length > 0
  ) {
    return (
      <>
        {contentVideo && (
          <div className="max-w-screen-xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {contentVideo.contents.map((content: any) => (
              <Link
                to={`/course/${params.id}/${params.hash}/${content.id}`}
                className="md:text-base font-light lg:text-base text-sm dark:text-gray-200 text-slate-600 rounded-lg overflow-hidden transform transition duration-500 hover:scale-105"
                key={content.id}
              >
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  className="max-w-full rounded-lg"
                />
                <h2 className="p-2">{content.title}</h2>
              </Link>
            ))}
          </div>
        )}
      </>
    );
  } else {
    return <>Error while fetching data from backend</>;
  }
};

const Course_slug_Video: React.FC<CourseSlugRedirectorProps1> = ({
  params,
}) => {
  const [see, setSee] = useState(false);
  return (
    <>
      <CourseSlugRedirector setSee={setSee} params={params} />
      {see && <CourseSlugViewer params={params} />}
    </>
  );
};
export default Course_slug_Video;
