import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./auth/dashboard";
import New_Courses from "./courses/new-courses";
import { New_Courses_slug } from "./courses/new-courses-slug";
import Add_Course from "./admin/add_course";
import { RecoilRoot, useRecoilValueLoadable } from "recoil";
import Course_slug from "./courses/course_slug";
import Add_Course_Content from "./admin/add_course_content";
import Course_slug_Video from "./courses/course_slug_video";
import { checkUser } from "./store/atoms/userAuth";
import Video_play from "./courses/video_play";
import Add_Video_Metadata from "./admin/add_video_metadata";
import CourseLayout from "./components/courseLayout";
import Home from "./components/home";
import CourseFolder from "./components/courseFolder";
import My_purchases from "./components/my_purchases";
import { LoginModal } from "./util/reuse_component/signupandloginmodel";
function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <CourseLayout>
                <Home />
              </CourseLayout>
            }
          />
          <Route
            path="/new-courses"
            element={
              <CourseLayout>
                <New_Courses />
              </CourseLayout>
            }
          />
          <Route
            path="/new-courses/:id"
            element={
              <CourseLayout>
                <New_Courses_slug />
              </CourseLayout>
            }
          />
          <Route path="/add_course" element={<Add_Course />} />
          <Route path="/add_course_content" element={<Add_Course_Content />} />
          <Route path="/add_video_metadata" element={<Add_Video_Metadata />} />
          <Route path="*" element={<ProtectedRouteUser />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

const ProtectedRouteUser = () => {
  // Check if user is authenticated
  const checkUserLoadable = useRecoilValueLoadable(checkUser);

  if (checkUserLoadable.state === "loading") {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  } else if (checkUserLoadable.state === "hasError") {
    return (
      <>
        <div>Error while fetching User information ...</div>
      </>
    );
  } else if (checkUserLoadable.state === "hasValue") {
    const isAuthenticated: boolean = checkUserLoadable.contents.success; // Assuming your checkUser atom returns a boolean
    return (
      <Routes>
        {isAuthenticated ? (
          <>
            <Route
              path="/dashboard"
              element={
                <CourseLayout>
                  <Dashboard />
                </CourseLayout>
              }
            />
            <Route
              path="/course/:id"
              element={
                <CourseFolder>
                  <Course_slug
                    params={{
                      id: "",
                      hash: "",
                      hash2: "",
                    }}
                    contentFolder={undefined}
                  />
                </CourseFolder>
              }
            />
            <Route
              path="/course/:id/:hash"
              element={
                <CourseFolder>
                  <Course_slug_Video
                    params={{
                      id: "",
                      hash: "",
                      hash2: "",
                    }}
                  />
                </CourseFolder>
              }
            />
            <Route
              path="/course/:id/:hash/:hash2"
              element={
                <CourseFolder>
                  <Video_play />
                </CourseFolder>
              }
            />
            <Route
              path="/purchases"
              element={
                <CourseLayout>
                  <My_purchases />
                </CourseLayout>
              }
            />
          </>
        ) : (
          <>
            <Route path="/course/:id" element={<LoginModal />} />
            <Route path="/course/:id/:hash" element={<LoginModal />} />
            <Route path="/course/:id/:hash/:hash2" element={<LoginModal />} />
            <Route path="/dashboard" element={<LoginModal />} />
            <Route path="/purchases" element={<LoginModal />} />
          </>
        )}
      </Routes>
    );
  }
};
export default App;
