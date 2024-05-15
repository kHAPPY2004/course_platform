import { Link, useLocation } from "react-router-dom";

const BreadCrumbs = () => {
  const location = useLocation();
  const paths = location.pathname
    .split("/")
    .filter((path) => path)
    .slice(2);
  const initialPath = location.pathname
    .split("/")
    .filter((path) => path)
    .slice(0, 2)
    .join("/");

  const highlight = location.pathname === `/${initialPath}`;
  const highlight2 = location.pathname === `/${initialPath}/${paths.join("/")}`;

  return (
    <>
      <nav className="flex mt-8 ml-5" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </Link>
          </li>
          {(location.pathname.includes("/course/1") ||
            location.pathname.startsWith("/course/2") ||
            location.pathname.startsWith("/course/3")) && (
            <li className="inline-flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                to={`/${initialPath}`}
                className={`${
                  highlight
                    ? "dark:text-white"
                    : "text-gray-700 dark:text-gray-400"
                } inline-flex ms-1 items-center text-sm font-medium  hover:text-blue-600  dark:hover:text-white`}
              >
                {location.pathname.includes("/course/1") && <div>0-100</div>}
                {location.pathname.includes("/course/2") && <div>0-1</div>}
                {location.pathname.includes("/course/3") && <div>1-100</div>}
              </Link>
            </li>
          )}

          {paths.map((path, index) => (
            <li key={index}>
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                {index === paths.length - 1 ? (
                  <span
                    className={`${
                      highlight2
                        ? "dark:text-black text-white"
                        : "text-gray-400 dark:text-gray-400"
                    }} ms-1 text-sm font-medium  md:ms-2`}
                  >
                    {path}
                  </span>
                ) : (
                  <Link
                    to={`/${initialPath}/${paths
                      .slice(0, index + 1)
                      .join("/")}`}
                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    {path}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default BreadCrumbs;