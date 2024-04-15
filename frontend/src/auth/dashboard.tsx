import React from "react";
import { checkUser } from "../store/atoms/userAuth";
import { useRecoilValueLoadable } from "recoil";

const Dashboard: React.FC = () => {
  const check_user = useRecoilValueLoadable(checkUser);

  if (check_user.state === "loading") {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  } else if (check_user.state === "hasError") {
    return (
      <>
        <div>Error while fetching data from backend</div>
      </>
    );
  } else if (check_user.state === "hasValue") {
    console.log("check", check_user);

    return (
      <div>
        <h1>Dashboard</h1>

        <div>
          <p>Name: {check_user.contents.user.name}</p>
          <p>Email: {check_user.contents.user.email}</p>
        </div>
      </div>
    );
  }
};

export default Dashboard;
