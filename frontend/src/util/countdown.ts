import { useState, useRef, useCallback } from "react";

const useCountdown = (initialTime: number = 30) => {
  const [countdown, setCountdown] = useState(initialTime);
  const timerId = useRef<number | undefined>(undefined);
  const timeoutId = useRef<number | undefined>(undefined);

  const clearCountdown = useCallback(() => {
    if (timerId.current !== undefined) {
      clearInterval(timerId.current);
      timerId.current = undefined;
    }
    if (timeoutId.current !== undefined) {
      clearTimeout(timeoutId.current);
      timeoutId.current = undefined;
    }
  }, []);

  const startCountdown = useCallback(() => {
    // Clear any existing countdowns before starting a new one
    clearCountdown();
    // Reset the countdown to the initial time
    setCountdown(initialTime);

    // Set a new interval to decrease the countdown every second
    timerId.current = window.setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    // Set a timeout to clear the interval when the countdown reaches zero
    timeoutId.current = window.setTimeout(() => {
      if (timerId.current !== undefined) {
        clearInterval(timerId.current);
        timerId.current = undefined;
      }
    }, initialTime * 1000);
  }, [clearCountdown, initialTime]);

  return { countdown, startCountdown, clearCountdown };
};

export default useCountdown;
