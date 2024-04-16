import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./auth/signup";
import Login from "./auth/login";
import Dashboard from "./auth/dashboard";
import Navbar from "./components/navbar";
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

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/new-courses" element={<New_Courses />} />
          <Route path="/new-courses/:id" element={<New_Courses_slug />} />
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/login"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route
              path="/signup"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route path="/course/:id" element={<Course_slug />} />
            <Route path="/course/:id/:hash" element={<Course_slug_Video />} />
            <Route path="/course/:id/:hash/:hash2" element={<Video_play />} />
          </>
        ) : (
          <>
            <Route
              path="/course/:id"
              element={<Navigate to="/login" replace />}
            />
            <Route
              path="/course/:id/:hash"
              element={<Navigate to="/login" replace />}
            />
            <Route
              path="/course/:id/:hash/:hash2"
              element={<Navigate to="/login" replace />}
            />
            <Route
              path="/dashboard"
              element={<Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={<Login completeUrl={location.pathname} />}
            />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
      </Routes>
    );
  }
};
export default App;
