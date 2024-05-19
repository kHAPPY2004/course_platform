import { useState, useRef, useCallback } from "react";

const useCountdown = (initialTime: number = 30) => {
  const [countdown, setCountdown] = useState(initialTime);
  const timerId = useRef<number | undefined>(undefined);
  const timeoutId = useRef<number | undefined>(undefined);

  const startCountdown = useCallback(() => {
    setCountdown(initialTime); // Reset countdown
    timerId.current = window.setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    timeoutId.current = window.setTimeout(() => {
      if (timerId.current !== undefined) {
        clearInterval(timerId.current);
      }
    }, initialTime * 1000);
  }, [initialTime]);

  const clearCountdown = useCallback(() => {
    if (timerId.current !== undefined) {
      clearInterval(timerId.current);
    }
    if (timeoutId.current !== undefined) {
      clearTimeout(timeoutId.current);
    }
  }, []);

  return { countdown, startCountdown, clearCountdown };
};

export default useCountdown;
