import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import {
  contentSlug,
  contentSlug1,
  filteredContentvideo,
} from "../store/atoms/getcontent";

const Course_slug_Video: React.FC = () => {
  const contentVideo = useRecoilValueLoadable(filteredContentvideo);
  console.log("contentVideo", contentVideo.contents);

  const setSlug = useSetRecoilState(contentSlug);
  const setContent_slug = useSetRecoilState(contentSlug1);
  const params: any = useParams();
  console.log("params", params.hash);

  useEffect(() => {
    return setSlug(params.hash);
  }, [params.hash, setSlug]);

  useEffect(() => {
    return setContent_slug(params.id);
  }, [params.id, setContent_slug]);

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
          <div className="max-w-screen-xl justify-between mx-auto p-4 cursor-pointer grid grid-cols-1 gap-5 md:grid-cols-3">
            {contentVideo.contents
              // .filter(
              //   (content: { parentId: any }) =>
              //     content.parentId === parseInt(params.hash)
              // )
              .map((content) => (
                <div className="bg-slate-400 m-10 p-5" key={content.id}>
                  <img
                    src={content.thumbnail}
                    alt={content.title}
                    style={{ maxWidth: "100%" }}
                    className="m-2 mb-4"
                  />
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
                  {/* <Link
                  className="bg-blue-400 rounded-md p-2"
                  to={`/new-courses/${content.slug}`}
                >
                  View Details
                </Link> */}
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
