import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { filteredContentvideo } from "../store/atoms/getcontent";
import CourseSlugRedirector from "../components/course_protect";
import BreadCrumbs from "../components/breadCrumbs";

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
        <BreadCrumbs />
        {contentVideo && (
          <div className="max-w-screen-xl justify-between mx-auto p-4 grid grid-cols-1 gap-5 md:grid-cols-3">
            {contentVideo.contents.map((content) => (
              <div className="bg-slate-400 m-10 p-5" key={content.id}>
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  style={{ maxWidth: "100%" }}
                  className="m-2 mb-4"
                />
                <div>{content.id}</div>
                <div>{content.title}</div>
                <div className="bg-red-200 m-2">
                  Content type: {content.type}
                </div>
                <div className="bg-pink-300 m-2">
                  description:{content.description}
                </div>
                <div className="bg-pink-400 m-2">hidden:{content.hidden}</div>
                <div className="bg-red-100 m-2">
                  notionMetadataId:{content.notionMetadataId}
                </div>
                <div>parentid : {content.parentId}</div>

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
