import React from "react";
import { Link } from "react-router-dom";

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
        {contentFolder && (
          <div className="max-w-screen-xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {contentFolder.contents.map((content: any) => (
              <Link
                to={`/course/${params.id}/${content.id}`}
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
