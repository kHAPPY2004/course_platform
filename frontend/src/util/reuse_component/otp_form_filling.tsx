import React from "react";

interface OtpFormProps {
  otp: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  countdown: number;
  sendOtp: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled: boolean;
}

const OtpForm: React.FC<OtpFormProps> = ({
  otp,
  handleChange,
  handleSubmit,
  countdown,
  sendOtp,
  isDisabled,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
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
            onClick={sendOtp}
            className={`${
              isDisabled ? "cursor-not-allowed" : "cursor-pointer"
            } hover:text-blue-400`}
          >
            RESEND
          </button>
        )}
      </div>
    </form>
  );
};

export default OtpForm;
