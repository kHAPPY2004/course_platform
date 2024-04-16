import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { contentSlug } from "../store/atoms/getcontent";
import { filteredUserPurchases } from "../store/atoms/userPurchases";

interface CourseSlugRedirectorProps {
  setSee: React.Dispatch<React.SetStateAction<boolean>>;
  params: { id: string; hash: string; hash2: string };
}
const CourseSlugRedirector: React.FC<CourseSlugRedirectorProps> = ({
  setSee,
  params,
}) => {
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
export default CourseSlugRedirector;
