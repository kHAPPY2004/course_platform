import { toast } from "react-toastify";

type ToastType = "success" | "warn" | "error";

export const showToast = (type: ToastType, message: string) => {
  toast[type](message, {
    position: "top-left",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};
