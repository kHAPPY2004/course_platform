import { useParams } from "react-router-dom";
export const New_Courses_slug: React.FC = () => {
  let params = useParams();
  return (
    <>
      <p>It's id is {params.id}</p>
    </>
  );
};
