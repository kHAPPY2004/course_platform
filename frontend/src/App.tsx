import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./auth/signup";
import Login from "./auth/login";
import Dashboard from "./auth/dashboard";
import Navbar from "./components/navbar";
import New_Courses from "./courses/new-courses";
import { New_Courses_slug } from "./courses/new-courses-slug";
import Add_Course from "./admin/add_course";
function App() {
  return (
    <Router>
      <>
        {/* <Navbar /> */}

        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navbar />} />
          <Route path="/new-courses" element={<New_Courses />} />
          <Route path="/new-courses/:id" element={<New_Courses_slug />} />
          <Route path="/add_course" element={<Add_Course />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
