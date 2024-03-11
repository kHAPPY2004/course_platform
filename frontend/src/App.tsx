import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./auth/signup";
import Login from "./auth/login";
import Dashboard from "./auth/dashboard";
import Navbar from "./components/navbar";
import New_Courses from "./courses/new-courses";
import { New_Courses_slug } from "./courses/new-courses-slug";
import Add_Course from "./admin/add_course";
import { RecoilRoot } from "recoil";
function App() {
  return (
    <Router>
      <>
        {/* <Navbar /> */}

        <Routes>
          <Route
            path="/signup"
            element={
              <RecoilRoot>
                <Signup />
              </RecoilRoot>
            }
          />
          <Route
            path="/login"
            element={
              <RecoilRoot>
                <Login completeUrl={location.pathname} />
              </RecoilRoot>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RecoilRoot>
                <Dashboard />
              </RecoilRoot>
            }
          />
          <Route path="/" element={<Navbar />} />

          <Route
            path="/new-courses"
            element={
              <RecoilRoot>
                <New_Courses />
              </RecoilRoot>
            }
          />
          <Route
            path="/new-courses/:id"
            element={
              <RecoilRoot>
                <New_Courses_slug />
              </RecoilRoot>
            }
          />

          <Route path="/add_course" element={<Add_Course />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
