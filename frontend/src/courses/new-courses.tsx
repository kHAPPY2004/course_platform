import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { coursesState } from "../store/atoms/getcourses";

const New_Courses: React.FC = () => {
  const courses = useRecoilValueLoadable(coursesState);

  if (courses.state === "loading") {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  } else if (courses.state === "hasError") {
    return (
      <>
        <div>Error while fetching data from backend</div>
      </>
    );
  } else if (courses.state === "hasValue") {
    return (
      <div>
        {courses.contents.data.length < 1 && <div>No Courses found</div>}
        {courses && (
          <>
            <div className="flex justify-center mt-5 md:pt-10 md:pb-5 md:text-xl font-bold ">
              Courses
            </div>
            <div className="max-w-screen-xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.contents.data.map((course: any) => (
                <div
                  className="bg-white dark:bg-gray-900 md:text-base lg:text-base xl:text-lg text-sm dark:text-gray-200 text-slate-600 shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105"
                  key={course.id}
                >
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="max-w-full rounded-t-lg"
                  />
                  <div className="md:p-4 p-3">
                    <h2 className="font-bold mb-2 text-lg md:text-xl">
                      {course.title}
                    </h2>
                    <p className="mb-4 text-sm md:text-lg">
                      {course.description.length > 60
                        ? course.description.substring(0, 60) + "..."
                        : course.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-semibold">
                        ₹{course.sellingPrice}
                        <span className="text-gray-500 dark:text-stone-600 line-through mx-2">
                          ₹{course.listPrice}
                        </span>
                      </div>
                      <div className="text-green-500 font-semibold">
                        {(
                          ((course.listPrice - course.sellingPrice) /
                            course.listPrice) *
                          100
                        ).toFixed(2)}
                        {"% off"}
                      </div>
                    </div>
                    <Link
                      className="block bg-blue-500 dark:bg-blue-900 text-white font-semibold text-center rounded-md py-2 hover:bg-blue-600 transition duration-300"
                      to={`/new-courses/${course.id}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
};

export default New_Courses;
