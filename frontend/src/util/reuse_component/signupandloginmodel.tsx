import Login from "../../auth/login";
import Signup from "../../auth/signup";

export const SignupModal = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-md z-40"></div>
      <div className="p-5 rounded shadow-lg w-full z-50 relative">
        <Signup />
      </div>
    </div>
  );
};

export const LoginModal = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-md z-40"></div>
      <div className="p-5 rounded shadow-lg w-full z-50 relative">
        <Login />
      </div>
    </div>
  );
};
