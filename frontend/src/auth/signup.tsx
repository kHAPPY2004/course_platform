import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { checkUser } from "../store/atoms/userAuth";
import { useSetRecoilState } from "recoil";
import useCountdown from "../util/countdown";
import OtpForm from "../util/reuse_component/otp_form_filling";
import EmailForm from "../util/reuse_component/email_form";
import { showToast } from "../util/toast";
interface LoginProps {
  completeUrl: string;
}
const Signup: React.FC<LoginProps> = ({ completeUrl }) => {
  const setCheckUser = useSetRecoilState(checkUser);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { countdown, startCountdown, clearCountdown } = useCountdown(30);
  const [unique_key_verifyOtp_signup, setUnique_key_verifyOtp_signup] =
    useState("");

  const handleChange = (e: {
    target: { name: string; value: React.SetStateAction<string> };
  }) => {
    const { name, value } = e.target;

    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmpassword") {
      setConfirmPassword(value);
    } else if (name === "phoneNumber") {
      setPhoneNumber(value);
    } else if (name === "otp") {
      setOtp(value);
    }
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      showToast("warn", "Passwords do not match");
      return; // Stop the function if passwords do not match
    }

    try {
      const res = await axios.post("/api/signup", {
        name,
        email,
        password,
        phoneNumber,
        unique_key_verifyOtp_signup,
      });
      if (res.data.success) {
        setCheckUser(res.data); // Update the checkUser atom
        showToast("success", res.data.message);
        // after request, clean the fields
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPhoneNumber("");
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
  const sendOtptoUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setIsDisabled(true);
      const res = await axios.post("/api/sendEmail", {
        email,
      });
      setIsDisabled(false);
      if (!res.data.success) {
        showToast("warn", res.data.message);
      } else {
        setIsEmail(true);
        startCountdown();
        showToast("success", res.data.message);
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
  const verifyOtp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/verifyOtp", {
        email,
        otp,
      });
      if (res.data.success) {
        setIsEmail(false);
        setIsVerified(true);
        setUnique_key_verifyOtp_signup(res.data.key);
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
            setIsEmail(false);
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
            {/* show only email page */}
            {!isVerified && !isEmail && (
              <>
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
                </h1>
                <EmailForm
                  onSubmit={sendOtptoUser}
                  email={email}
                  handleChange={handleChange}
                  isDisabled={isDisabled}
                />
                <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-gray-600 hover:underline dark:text-gray-500"
                  >
                    Login here
                  </Link>
                </div>
              </>
            )}
            {/* otp verification page  */}
            {!isVerified && isEmail && (
              <>
                <div className="flex flex-row justify-between">
                  <button
                    onClick={() => {
                      setIsEmail(false);
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
                <OtpForm
                  otp={otp}
                  handleChange={handleChange}
                  handleSubmit={verifyOtp}
                  countdown={countdown}
                  sendOtp={sendOtptoUser}
                  isDisabled={isDisabled}
                />
              </>
            )}
            {/* final page to fill the password and name */}
            {isVerified && (
              <>
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
                </h1>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 md:space-y-6"
                  method="POST"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      value={name}
                      onChange={handleChange}
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="your name"
                      required
                    />
                  </div>
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
                      htmlFor="phoneNumber"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number
                    </label>
                    <input
                      value={phoneNumber}
                      onChange={handleChange}
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="123-456-7890"
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
                  <div>
                    <label
                      htmlFor="confirmpassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm password
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
                    Create an account
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    {/* <Link
                    to="/login"
                    className="font-medium text-gray-600 hover:underline dark:text-gray-500"
                  >
                    Login here
                  </Link> */}
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
