import React from "react";
import { Link } from "react-router-dom";
import BreadCrumbs from "../components/breadCrumbs";

interface CourseSlugRedirectorProps1 {
  params: { id: string; hash: string; hash2: string };
  contentFolder: any;
}
const CourseSlugViewer: React.FC<CourseSlugRedirectorProps1> = ({
  params,
  contentFolder,
}) => {
  console.log("Content Folder comes from sidebar", contentFolder);
  if (!contentFolder) {
    return <div>Loading...</div>;
  }

  if (contentFolder.state === "hasError") {
    return <div>Error while fetching data from backend</div>;
  }
  if (contentFolder.state === "hasValue" && contentFolder.contents.length > 0) {
    return (
      <>
        <BreadCrumbs />
        {contentFolder && (
          <div className="max-w-screen-xl justify-between mx-auto p-4 grid grid-cols-1 gap-5 md:grid-cols-3">
            {contentFolder.contents.map((content: any) => (
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
                  to={`/course/${params.id}/${content.id}`}
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </>
    );
  } else {
    return <>No data...</>;
  }
};
const Course_slug: React.FC<CourseSlugRedirectorProps1> = ({
  contentFolder,
  params,
}) => {
  return <CourseSlugViewer params={params} contentFolder={contentFolder} />;
};

export default Course_slug;
