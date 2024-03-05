import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <div>hello there...navbar</div>
      <nav>
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
