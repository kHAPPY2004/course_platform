import { Link, useLocation, useNavigate } from "react-router-dom";
import { checkUser } from "../store/atoms/userAuth";
import {
  useRecoilState,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import { sidebarOpen } from "../store/atoms/sidebar";
import axios from "axios";
import { showToast } from "../util/toast";
import useTheme from "../util/usetheme";
import ToastConfig from "../util/toastcontainer";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toggleButtonHidden =
    location.pathname === "/" ||
    location.pathname.startsWith("/new-courses") ||
    location.pathname === "/dashboard" ||
    location.pathname === "/purchases";

  const check_user = useRecoilValueLoadable(checkUser);
  const setCheckUser = useSetRecoilState(checkUser);
  const [sidebar, setSidebar] = useRecoilState(sidebarOpen);
  const [theme, toggleTheme] = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => {
    setDropdownOpen(false);
  };
  const getIcon = () => {
    if (theme === "dark") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5"
        >
          <path
            fillRule="evenodd"
            d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        />
      </svg>
    );
  };

  const toggleSidebar = () => {
    setSidebar((currentState) => !currentState);
  };

  const logout = async (
    email: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/logout", { email });
      if (res.data.success) {
        showToast("warn", res.data.message);
      } else {
        showToast("success", res.data.message);
        navigate("/");
        setCheckUser(res.data); // Update the checkUser atom
      }
    } catch (error) {
      showToast("error", "Error! Please try after some time");
    }
  };
  return (
    <>
      <ToastConfig />
      <nav className="bg-white bg-opacity-90 dark:bg-gray-950 dark:bg-opacity-90 fixed w-full z-20 top-0 start-0 backdrop-blur shadow-lg dark:shadow-slate-900 transform transition duration-500">
        <div className="flex flex-wrap items-center justify-between px-1 md:px-4 py-2 md:py-4">
          <div className="flex space-x-4 md:space-x-5">
            {!toggleButtonHidden && (
              <button onClick={toggleSidebar}>
                {sidebar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6 md:w-8 md:h-8 text-black dark:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6 md:w-8 md:h-8 text-black dark:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
            )}
            <Link
              to="/"
              className="flex items-center md:px-5 md:space-x-3 rtl:space-x-reverse"
            >
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Flowbite
              </span>
            </Link>
          </div>
          <div className="flex">
            {check_user.state === "hasValue" &&
              !check_user.contents.success && (
                <button
                  onClick={() => {
                    toggleTheme(theme === "dark" ? "light" : "dark");
                    closeDropdown();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  {getIcon()}
                </button>
              )}
            <div className="relative">
              <div
                className="text-black dark:text-white bg-gray-200 dark:bg-gray-600 rounded-full p-2 cursor-pointer"
                onClick={toggleDropdown}
              >
                {check_user.state === "hasValue" &&
                check_user.contents.success ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                  {check_user.state === "hasValue" &&
                  check_user.contents.success ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={closeDropdown}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={(e) => {
                          logout(check_user.contents.data.email, e);
                          closeDropdown();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                      <div className="border-t border-gray-200 dark:border-gray-700"></div>
                      <button
                        onClick={() => {
                          toggleTheme(theme === "dark" ? "light" : "dark");
                          closeDropdown();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {getIcon()}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={closeDropdown}
                      >
                        Signup
                      </Link>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={closeDropdown}
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>{" "}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
