import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { checkUser } from "../store/atoms/userAuth";
import { showToast } from "../util/toast";
import useCountdown from "../util/countdown";
import OtpForm from "../util/reuse_component/otp_form_filling";
import EmailForm from "../util/reuse_component/email_form";

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
  const [attemptLeftforSendOtp, setAttemptLeftforSendOtp] = useState<
    string | undefined
  >(undefined);
  const [attemptLeftforVerifyOtp, setAttemptLeftforVerifyOtp] = useState<
    string | undefined
  >(undefined);
  const [attemptLeftforVerifyOtpforgot, setAttemptLeftforVerifyOtpforgot] =
    useState<string | undefined>(undefined);

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
      setAttemptLeftforSendOtp(res.headers["x-ratelimit-attempts-left"]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 429) {
            showToast("error", error.response.data.message);
            // Perform specific actions for 429 status code
            setIsDisabled(false);
            setLogin_otp(false);
          } else if (
            error.response.status === 500 ||
            error.response.status === 400
          ) {
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
  // verify otp and login
  const handleSubmit_through_otp = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    try {
      setIsDisabled(true);
      const res = await axios.post("/api/verifyOtpAndLogin", {
        email,
        otp,
      });
      setIsDisabled(false);
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
      setAttemptLeftforVerifyOtp(res.headers["x-ratelimit-attempts-left"]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            showToast("error", error.response.data.message);
            // Perform specific actions for 401 status code
            setOtp("");
            setLogin_otp(false);
          } else if (
            error.response.status === 500 ||
            error.response.status === 400
          ) {
            showToast("error", error.response.data.message);
          } else if (error.response.status === 429) {
            showToast("error", error.response.data.message);
            // Perform specific actions for 401 status code
            setOtp("");
            setIsDisabled(false);
            setLogin_otp(false);
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
      setAttemptLeftforSendOtp(res.headers["x-ratelimit-attempts-left"]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 429) {
            showToast("error", error.response.data.message);
            // Perform specific actions for 401 status code
            setIsDisabled(false);
            setForgotpassword(false);
          } else if (
            error.response.status === 500 ||
            error.response.status === 400
          ) {
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
      setAttemptLeftforVerifyOtpforgot(
        res.headers["x-ratelimit-attempts-left"]
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            showToast("error", error.response.data.message);
            // Perform specific actions for 401 status code
            setOtp("");
            setForgotpassword(false);
          } else if (
            error.response.status === 500 ||
            error.response.status === 400
          ) {
            showToast("error", error.response.data.message);
          } else if (error.response.status === 429) {
            showToast("error", error.response.data.message);
            // Perform specific actions for 401 status code
            setOtp("");
            setIsDisabled(false);
            setForgotpassword(false);
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
                  <EmailForm
                    onSubmit={isUserh}
                    email={email}
                    handleChange={handleChange}
                    isDisabled={isDisabled}
                  />
                  <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Create a new account?{" "}
                    <Link
                      to="/Signup"
                      className="font-medium text-gray-600 hover:underline dark:text-gray-500"
                    >
                      Signup
                    </Link>
                  </div>
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
                  {attemptLeftforSendOtp !== undefined &&
                    attemptLeftforSendOtp !== "0" && (
                      <div className="text-red-300">
                        {attemptLeftforSendOtp} attempts Left
                      </div>
                    )}
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
                      Verify OTP to login
                    </h1>
                    <div></div>
                  </div>
                  <OtpForm
                    otp={otp}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit_through_otp}
                    countdown={countdown}
                    sendOtp={sendOtpandlogin}
                    isDisabled={isDisabled}
                  />
                  {attemptLeftforVerifyOtp !== undefined &&
                    attemptLeftforVerifyOtp !== "0" && (
                      <div className="text-red-300">
                        {attemptLeftforVerifyOtp} attempts Left
                      </div>
                    )}
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
                      Verify to reset the password
                    </h1>
                    <div></div>
                  </div>
                  <OtpForm
                    otp={otp}
                    handleChange={handleChange}
                    handleSubmit={verifyOtp_forgot}
                    countdown={countdown}
                    sendOtp={sendOtp_forgot}
                    isDisabled={isDisabled}
                  />
                  {attemptLeftforVerifyOtpforgot !== undefined &&
                    attemptLeftforVerifyOtpforgot !== "0" && (
                      <div className="text-red-300">
                        {attemptLeftforVerifyOtpforgot} attempts Left
                      </div>
                    )}
                </>
              )}

            {isVerified && (
              <>
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Update Credentials
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
