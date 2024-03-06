import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { redirect } from "react-router-dom";
interface UserData {
  name: string;
  email: string;
  sessionToken: string;
  // Add other properties as needed
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchData = async (e: { preventDefault: () => void }) => {
   e.preventDefault();
  const fetchData = async () => {
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
      console.log("response", response);
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


  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={fetchData} className="bg-red-400 cursor-pointer p-1 m-1 rounded-md">
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
};

export default Dashboard;
