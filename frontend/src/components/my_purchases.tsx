import { Link } from "react-router-dom";
import { myPurchaseContent } from "../store/atoms/userPurchases";
import { useRecoilValueLoadable } from "recoil";

const My_purchases = () => {
  const myPurchase_Content = useRecoilValueLoadable(myPurchaseContent);

  if (myPurchase_Content.state === "loading") {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  } else if (myPurchase_Content.state === "hasError") {
    return (
      <>
        <div>Error while fetching data from backend</div>
      </>
    );
  } else if (myPurchase_Content.state === "hasValue") {
    return (
      <>
        <div>
          {myPurchase_Content.contents.length < 1 && (
            <div className="mt-10 p-4 text-red-300">
              You have not purchases any course yet...
            </div>
          )}
          {myPurchase_Content.contents.length > 0 && (
            <>
              <div className="mt-10 p-4 font-bold text-xl ml-4">
                My Purchases
              </div>
              <div className="max-w-screen-xl justify-between mx-auto p-4 grid grid-cols-1 gap-5 md:grid-cols-3">
                {myPurchase_Content.contents.map((course: any) => (
                  <div
                    className="bg-slate-400 m-3 p-5 rounded-lg"
                    key={course.id}
                  >
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
                    <div>selling price : {course.sellingPrice}</div>
                    <div>List price : {course.listPrice}</div>
                    <div className="text-green-400 font-semibold">
                      {(
                        ((course.listPrice - course.sellingPrice) /
                          course.listPrice) *
                        100
                      ).toFixed(2)}
                      {" % off"}
                    </div>
                    {/* Add more details if needed */}
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      style={{ maxWidth: "100%" }}
                      className="m-2 mb-4"
                    />
                    <Link
                      className="bg-blue-400 rounded-md p-2"
                      to={`/new-courses/${course.id}`}
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </>
    );
  }
};

export default My_purchases;
