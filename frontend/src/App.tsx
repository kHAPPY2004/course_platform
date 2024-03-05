// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./auth/signup";
// import Login from "./auth/login";
// import Dashboard from "./auth/dashboard";
// import Navbar from "./components/navbar";
function App() {
  return (
    <>
      <Signup />
    </>
    // <Router>
    //   <>
    //     {/* <Navbar /> */}

    //     <Routes>
    //       <Route path="/signup" element={<Signup />} />
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/dashboard" element={<Dashboard />} />
    //       <Route path="/" element={<Navbar />} />
    //     </Routes>
    //   </>
    // </Router>
  );
}

export default App;
