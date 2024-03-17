import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { contentSlug, filteredContentvideo } from "../store/atoms/getcontent";

const Course_slug_Video: React.FC = () => {
  const params: any = useParams();
  console.log(params);
  const setSlug = useSetRecoilState(contentSlug);
  const contentVideo = useRecoilValueLoadable(filteredContentvideo);
  console.log("content Video", contentVideo);

  useEffect(() => {
    setSlug({ id: params.id, hash: params.hash, hash2: params.hash2 }); // Set both slug values in one useEffect
  }, [params.id, params.hash, params.hash2, setSlug]);

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

export default Course_slug_Video;
