import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { filteredCoursesState, slugState } from "../store/atoms/getcourses";
import { useEffect } from "react";
export const New_Courses_slug: React.FC = () => {
  const [slug, setSlug] = useRecoilState(slugState); // Get and set the current slug
  const params: any = useParams();
  // update the slug
  useEffect(() => {
    return setSlug(params.id);
  }, [params.id, setSlug]);
  const course = useRecoilValueLoadable(filteredCoursesState);
  console.log(course);
  if (course.state === "loading") {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  } else if (course.state === "hasError") {
    return (
      <>
        <div>Error while fetching data from backend</div>
      </>
    );
  } else if (course.state === "hasValue" && course.contents.length > 0) {
    return (
      <>
        <div>slug: {slug}</div>
        <div>{course.contents[0].id}</div>
        <div>{course.contents[0].appxCourseId}</div>
        <div>{course.contents[0].description}</div>
        <div>{course.contents[0].discordRoleId}</div>
        <div>{course.contents[0].id}</div>
        <div>{course.contents[0].imageUrl}</div>
      </>
    );
  } else {
    return <div>No course found for the provided slug</div>;
  }
};
// };
