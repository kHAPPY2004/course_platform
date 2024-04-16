import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { contentSlug, filteredContentfolder } from "../store/atoms/getcontent";
import { filteredUserPurchases } from "../store/atoms/userPurchases";

const CourseSlugRedirector: React.FC<{
  setSee: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setSee }) => {
  const params: any = useParams();
  const setSlug = useSetRecoilState(contentSlug);
  const filterUser = useRecoilValueLoadable(filteredUserPurchases);
  const navigate = useNavigate();

  useEffect(() => {
    setSlug({ id: params.id, hash: params.hash, hash2: params.hash2 });
  }, [params.id, params.hash, params.hash2, setSlug]);

  useEffect(() => {
    if (filterUser.state === "hasValue") {
      const filteredPurch =
        filterUser.contents.length > 0 &&
        filterUser.contents.filter((purchase: any) => {
          return purchase.courseId === parseInt(params.id);
        });
      //@ts-ignore
      if (filteredPurch.length) {
        setSee(true);
      } else {
        setSee(false);
        navigate(`/new-courses/${params.id}`);
      }
    }
  }, [filterUser, params.id, navigate]);

  return null;
};
const CourseSlugViewer: React.FC = () => {
  const params: any = useParams();
  const contentFolder = useRecoilValueLoadable(filteredContentfolder);
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
        {contentFolder && (
          <div className="max-w-screen-xl justify-between mx-auto p-4 grid grid-cols-1 gap-5 md:grid-cols-3">
            {contentFolder.contents.map((content) => (
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
    return <>Error while fetching data from backend end</>;
  }
};
const Course_slug: React.FC = () => {
  const [see, setSee] = useState(false);
  return (
    <>
      <CourseSlugRedirector setSee={setSee} />
      {see && <CourseSlugViewer />}
    </>
  );
};

export default Course_slug;
