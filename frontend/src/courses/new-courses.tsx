import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
interface UserData {
  appxCourseId: number;
  description: string;
  discordRoleId: string;
  imageUrl: string;
  slug: string;
  title: string;
  id: number;
}

const New_Courses: React.FC = () => {
  const [courses, setCourses] = useState<UserData[] | null>(null);
  useEffect(() => {
    console.log("use-effect");
    try {
      // Fetch user details
      axios
        .get("/api/new-courses", {
          withCredentials: true,
        })
        .then((response) => {
          setCourses(response.data.new_courses);
        })
        .catch((err) => console.error("Error fetching user data:", err));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  return (
    <div>
      {courses && (
        <div className="max-w-screen-xl justify-between mx-auto p-4 cursor-pointer grid grid-cols-1 gap-5 md:grid-cols-3">
          {courses.map((course) => (
            <div className="bg-slate-400 m-10 p-5" key={course.id}>
              <div>{course.title}</div>
              <div className="bg-red-200 m-2">
                Appx Course ID: {course.appxCourseId}
              </div>
              <div className="bg-pink-300 m-2">
                description:{course.description}
              </div>
              <div className="bg-pink-400 m-2">
                discordRoleId:{course.discordRoleId}
              </div>
              <div className="bg-red-100 m-2">slug:{course.slug}</div>
              {/* Add more details if needed */}
              <img
                src={course.imageUrl}
                alt={course.title}
                style={{ maxWidth: "100%" }}
                className="m-2 mb-4"
              />
              <Link
                className="bg-blue-400 rounded-md p-2"
                to={`/new-courses/${course.slug}`}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default New_Courses;
