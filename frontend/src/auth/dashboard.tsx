import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { checkUser } from "../store/atoms/userAuth";
import { useRecoilValueLoadable } from "recoil";
interface UserData {
  name: string;
  email: string;
  sessionToken: string;
  // Add other properties as needed
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const check_user = useRecoilValueLoadable(checkUser);
  console.log("check", check_user);

  useEffect(() => {
    if (!check_user.contents.data?.success) {
      console.log("redirect to home page you are login");
      navigate("/");
    }
  }, [check_user.contents.data?.success, navigate]);

  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchData = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      // Fetch user details
      const response: AxiosResponse<UserData> = await axios.get(
        "/api/dashboard",
        {
          withCredentials: true,
        }
      ); // Include credentials

      if (response.status === 200) {
        setUserData(response.data);
      } else if (response.status === 401) {
        // Redirect to login page if unauthorized
        redirect("/login");
        console.log("redirect to login");
      } else {
        // Handle other errors
        console.error("Error fetching user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
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
    return (
      <div>
        <h1>Dashboard</h1>
        <button
          onClick={fetchData}
          className="bg-red-400 cursor-pointer p-1 m-1 rounded-md"
        >
          get user data
        </button>
        {userData && (
          <div>
            <p>Name: {userData.name}</p>
            <p>Email: {userData.email}</p>
            <p>Session Token: {userData.sessionToken}</p>
            {/* Render other dashboard components here */}
          </div>
        )}
      </div>
    );
  }
};

export default Dashboard;
