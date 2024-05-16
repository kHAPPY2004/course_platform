import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const Nodemailerr = () => {
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/sendEmail", {
        email: "xdevs12@gmail.com",
      });

      if (!res.data.success) {
        console.log("error comes in frontend---", res.data);
        toast.warn(res.data.message, {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        console.log("success in frontend-----", res.data);
        toast.success(res.data.message, {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data:", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  return (
    <>
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
      <button
        onClick={handleSubmit}
        className="bg-blue-400 rounded-md p-1 m-1 px-3"
      >
        Buy Now
      </button>
    </>
  );
};

export default Nodemailerr;
