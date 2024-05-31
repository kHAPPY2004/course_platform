import { loginPopupState, signupPopupState } from "../store/atoms/userAuth";
import { useRecoilState } from "recoil";

const usePopupState = () => {
  const [showLogin, setShowLogin] = useRecoilState(loginPopupState);
  const [showSignup, setShowSignup] = useRecoilState(signupPopupState);

  const openLogin = () => {
    setShowLogin(true);
    document.body.classList.add("body-blur");
  };

  const closeLogin = () => {
    setShowLogin(false);
    document.body.classList.remove("body-blur");
  };

  const openSignup = () => {
    setShowSignup(true);
    document.body.classList.add("body-blur");
  };

  const closeSignup = () => {
    setShowSignup(false);
    document.body.classList.remove("body-blur");
  };

  return {
    showLogin,
    openLogin,
    closeLogin,
    showSignup,
    openSignup,
    closeSignup,
  };
};

export default usePopupState;
