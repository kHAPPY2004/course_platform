import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <nav className="bg-gray-600">
        <ul>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/dashboard">dashboard</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
