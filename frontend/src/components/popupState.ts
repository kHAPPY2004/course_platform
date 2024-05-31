import {
  loginPopupState,
  loginPopupState1,
  signupPopupState,
} from "../store/atoms/userAuth";
import { useRecoilState } from "recoil";

const usePopupState = () => {
  const [showLogin, setShowLogin] = useRecoilState(loginPopupState);
  const [showLogin1, setShowLogin1] = useRecoilState(loginPopupState1);
  const [showSignup, setShowSignup] = useRecoilState(signupPopupState);

  const openLogin = () => {
    setShowLogin(true);
    document.body.classList.add("body-blur");
  };
  const openLogin1 = () => {
    setShowLogin1(true);
    document.body.classList.add("body-blur");
  };

  const closeLogin = () => {
    setShowLogin(false);
    setShowLogin1(false);
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
    showLogin1,
    openLogin,
    openLogin1,
    closeLogin,
    showSignup,
    openSignup,
    closeSignup,
  };
};

export default usePopupState;
