import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { checkUser } from "../store/atoms/userAuth";
import { showToast } from "../util/toast";
import useCountdown from "../util/countdown";

interface LoginProps {
  completeUrl: string;
}
const Login: React.FC<LoginProps> = ({ completeUrl }) => {
  const setCheckUser = useSetRecoilState(checkUser);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [login_pass, setLogin_pass] = useState(false);
  const [login_otp, setLogin_otp] = useState(false);
  const [forgotpassword, setForgotpassword] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [otp, setOtp] = useState("");
  const { countdown, startCountdown, clearCountdown } = useCountdown(30);

  const handleChange = (e: {
    target: { name: string; value: React.SetStateAction<string> };
  }) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmpassword") {
      setConfirmPassword(value);
    } else if (name === "otp") {
      setOtp(value);
    }
  };
  //check user is present in database
  const isUserh = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/isuserpresent", {
        email,
      });
      if (res.data.success) {
        setIsUser(true);
        showToast("success", res.data.message);
      } else {
        showToast("warn", res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          showToast("error", error.response.data.message);
        } else {
          showToast(
            "error",
            "An unexpected error occurred. Please try again later."
          );
        }
      } else {
        showToast("error", "Server Down. Please try after some time.");
      }
    }
  };
  // option to login through password
  const handleSubmit_through_pass = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login", {
        email,
        password,
      });
      if (res.data.success) {
        setEmail("");
        setPassword("");
        // Update the checkUser selector after successful login
        setCheckUser(res.data); // Update the checkUser atom
        setLogin_pass(false);
        showToast("success", res.data.message);
        navigate(completeUrl);
      } else {
        showToast("warn", res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          showToast("error", error.response.data.message);
        } else {
          showToast(
            "error",
            "An unexpected error occurred. Please try again later."
          );
        }
      } else {
        showToast("error", "Server Down. Please try after some time.");
      }
    }
  };
  // send otp for login
  const sendOtpandlogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setIsDisabled(true);
      const res = await axios.post("/api/sendotp_for_login_forgot", {
        email,
      });
      setIsDisabled(false);
      if (res.data.success) {
        setLogin_otp(true);
        startCountdown();
        showToast("success", res.data.message);
      } else {
        showToast("warn", res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          showToast("error", error.response.data.message);
        } else {
          showToast(
            "error",
            "An unexpected error occurred. Please try again later."
          );
        }
      } else {
        showToast("error", "Server Down. Please try after some time.");
      }
    }
  };
  // verify otp and login
  const handleSubmit_through_otp = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/verifyOtpAndLogin", {
        email,
        otp,
      });
      if (res.data.success) {
        setEmail("");
        setOtp("");
        // Update the checkUser selector after successful login
        setCheckUser(res.data); // Update the checkUser atom
        setLogin_otp(false);
        showToast("success", res.data.message);
        navigate(completeUrl);
      } else {
        showToast("warn", res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            showToast("error", error.response.data.message);
            // Perform specific actions for 401 status code
            setOtp("");
            setLogin_otp(false);
          } else if (error.response.status === 500) {
            showToast("error", error.response.data.message);
          }
        } else {
          showToast(
            "error",
            "An unexpected error occurred. Please try again later."
          );
        }
      } else {
        showToast("error", "Server Down. Please try after some time.");
      }
    }
  };
  // reset_password and login
  const Forgot = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/forgot", {
        email,
        password,
      });
      if (res.data.success) {
        // Update the checkUser selector after successful login
        setCheckUser(res.data); // Update the checkUser atom
        showToast("success", res.data.message);
        navigate(completeUrl);
      } else {
        showToast("warn", res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          showToast("error", error.response.data.message);
        } else {
          showToast(
            "error",
            "An unexpected error occurred. Please try again later."
          );
        }
      } else {
        showToast("error", "Server Down. Please try after some time.");
      }
    }
  };
  // send otp for forgot_password
  const sendOtp_forgot = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setIsDisabled(true);
      const res = await axios.post("/api/sendotp_for_login_forgot", {
        email,
      });
      setIsDisabled(false);
      if (res.data.success) {
        setForgotpassword(true);
        startCountdown();
        showToast("success", res.data.message);
      } else {
        showToast("warn", res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          showToast("error", error.response.data.message);
        } else {
          showToast(
            "error",
            "An unexpected error occurred. Please try again later."
          );
        }
      } else {
        showToast("error", "Server Down. Please try after some time.");
      }
    }
  };
  // verify otp for forgot_password
  const verifyOtp_forgot = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/verifyOtpforgot", {
        email,
        otp,
      });
      if (res.data.success) {
        setIsUser(false);
        setIsVerified(true);
        showToast("success", res.data.message);
      } else {
        showToast("warn", res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            showToast("error", error.response.data.message);
            // Perform specific actions for 401 status code
            setOtp("");
            setForgotpassword(false);
          } else if (error.response.status === 500) {
            showToast("error", error.response.data.message);
          }
        } else {
          showToast(
            "error",
            "An unexpected error occurred. Please try again later."
          );
        }
      } else {
        showToast("error", "Server Down. Please try after some time.");
      }
    }
  };

  return (
    <section className="text-gray-600">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {/* shows only email field */}
            {!isVerified &&
              !isUser &&
              !login_pass &&
              !login_otp &&
              !forgotpassword && (
                <>
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Login to account
                  </h1>
                  <form
                    onSubmit={isUserh}
                    className="space-y-4 md:space-y-6"
                    method="POST"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Your email
                      </label>
                      <input
                        value={email}
                        onChange={handleChange}
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@company.com"
                        required
                      />
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          aria-describedby="terms"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-gray-600 dark:ring-offset-gray-800"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="terms"
                          className="font-light text-gray-500 dark:text-gray-300"
                        >
                          I accept the{" "}
                          <a
                            className="font-medium text-gray-600 hover:underline dark:text-gray-500"
                            href="#"
                          >
                            Terms and Conditions
                          </a>
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    >
                      Next
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Create a new account?{" "}
                      <Link
                        to="/Signup"
                        className="font-medium text-gray-600 hover:underline dark:text-gray-500"
                      >
                        Signup
                      </Link>
                    </p>
                  </form>
                </>
              )}
            {/* shows choose page */}
            {!isVerified &&
              isUser &&
              !login_pass &&
              !login_otp &&
              !forgotpassword && (
                <>
                  <div className="flex flex-row justify-between">
                    <button onClick={() => setIsUser(false)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <g clipPath="url(#a)">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.25-7.25a.75.75 0 0 0 0-1.5H8.66l2.1-1.95a.75.75 0 1 0-1.02-1.1l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 0 0 1.02-1.1l-2.1-1.95h4.59Z"
                            clipRule="evenodd"
                          />
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path d="M0 0h20v20H0z" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Login to your Account
                    </h1>
                    <div></div>
                  </div>
                  <div className="flex justify-center p-2 m-4 mt-10 text-white bg-blue-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                    <button onClick={() => setLogin_pass(true)}>
                      Login with Password
                    </button>
                  </div>
                  <div className="flex justify-center p-2 m-4 text-white bg-blue-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                    <button
                      disabled={isDisabled}
                      onClick={sendOtpandlogin}
                      className={`${
                        isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      Login with OTP
                    </button>
                  </div>
                  <div className="flex justify-center p-2 m-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    <button
                      disabled={isDisabled}
                      onClick={sendOtp_forgot}
                      className={`${
                        isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                      } text-sm font-light hover:text-white text-gray-500 dark:text-gray-400`}
                    >
                      Forgot Password
                    </button>
                  </div>
                </>
              )}
            {/* Login with password */}
            {!isVerified &&
              isUser &&
              login_pass &&
              !login_otp &&
              !forgotpassword && (
                <>
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Login to account
                  </h1>
                  <form
                    onSubmit={handleSubmit_through_pass}
                    className="space-y-4 md:space-y-6"
                    method="POST"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Your email
                      </label>
                      <input
                        value={email}
                        onChange={handleChange}
                        type="email"
                        name="email"
                        id="email"
                        readOnly
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        value={password}
                        onChange={handleChange}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    >
                      Login
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Create a new account?{" "}
                      <Link
                        to="/Signup"
                        className="font-medium text-gray-600 hover:underline dark:text-gray-500"
                      >
                        Signup
                      </Link>
                    </p>
                  </form>
                </>
              )}

            {/* Login with otp */}
            {!isVerified &&
              isUser &&
              !login_pass &&
              login_otp &&
              !forgotpassword && (
                <>
                  <div className="flex flex-row justify-between">
                    <button
                      onClick={() => {
                        setLogin_otp(false);
                        setOtp("");
                        clearCountdown();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <g clipPath="url(#a)">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.25-7.25a.75.75 0 0 0 0-1.5H8.66l2.1-1.95a.75.75 0 1 0-1.02-1.1l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 0 0 1.02-1.1l-2.1-1.95h4.59Z"
                            clipRule="evenodd"
                          />
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path d="M0 0h20v20H0z" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Verify OTP
                    </h1>
                    <div></div>
                  </div>
                  <form
                    onSubmit={handleSubmit_through_otp}
                    className="space-y-4 md:space-y-6"
                    method="POST"
                  >
                    <div>
                      <label
                        htmlFor="otp"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Enter OTP
                      </label>
                      <input
                        value={otp}
                        onChange={handleChange}
                        type="text"
                        name="otp"
                        id="otp"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter your OTP"
                        required
                      />
                    </div>
                    <div className="bg-green-200 p-2 rounded-lg">
                      We’ve sent an OTP to your email
                    </div>

                    <button
                      type="submit"
                      className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    >
                      Submit
                    </button>
                    <div className="text-sm flex justify-center mt-2 border p-2">
                      {countdown > 0 ? (
                        <>Request new OTP in {countdown} seconds</>
                      ) : (
                        <button
                          disabled={isDisabled}
                          onClick={sendOtpandlogin}
                          className={`${
                            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                          } hover:text-blue-400`}
                        >
                          RESEND
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}

            {/* otp verification for forgot password */}
            {!isVerified &&
              isUser &&
              !login_pass &&
              !login_otp &&
              forgotpassword && (
                <>
                  <div className="flex flex-row justify-between">
                    <button
                      onClick={() => {
                        setForgotpassword(false);
                        setOtp("");
                        clearCountdown();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <g clipPath="url(#a)">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.25-7.25a.75.75 0 0 0 0-1.5H8.66l2.1-1.95a.75.75 0 1 0-1.02-1.1l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 0 0 1.02-1.1l-2.1-1.95h4.59Z"
                            clipRule="evenodd"
                          />
                        </g>
                        <defs>
                          <clipPath id="a">
                            <path d="M0 0h20v20H0z" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Verify OTP
                    </h1>
                    <div></div>
                  </div>
                  <form
                    onSubmit={verifyOtp_forgot}
                    className="space-y-4 md:space-y-6"
                    method="POST"
                  >
                    <div>
                      <label
                        htmlFor="otp"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Enter OTP
                      </label>
                      <input
                        value={otp}
                        onChange={handleChange}
                        type="text"
                        name="otp"
                        id="otp"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter your OTP"
                        required
                      />
                    </div>
                    <div className="bg-green-200 p-2 rounded-lg">
                      We’ve sent an OTP to your email
                    </div>

                    <button
                      type="submit"
                      className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    >
                      Submit
                    </button>
                    <div className="text-sm flex justify-center mt-2 border p-2">
                      {countdown > 0 ? (
                        <>Request new OTP in {countdown} seconds</>
                      ) : (
                        <button
                          disabled={isDisabled}
                          onClick={sendOtp_forgot}
                          className={`${
                            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                          } hover:text-blue-400`}
                        >
                          RESEND
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}

            {isVerified && (
              <>
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create a New Password
                </h1>
                <form
                  onSubmit={Forgot}
                  className="space-y-4 md:space-y-6"
                  method="POST"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      value={email}
                      onChange={handleChange}
                      type="email"
                      name="email"
                      id="email"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      New Password
                    </label>
                    <input
                      value={password}
                      onChange={handleChange}
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmpassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm New Password
                    </label>
                    <input
                      value={confirmpassword}
                      onChange={handleChange}
                      type="password"
                      name="confirmpassword"
                      id="confirmpassword"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                  >
                    Update Password and Login
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
