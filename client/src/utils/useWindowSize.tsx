import { useState, useEffect, useCallback } from "react";

const useWindowSize = () => {
  const getSize = useCallback(() => {
    return {
      width: window.innerWidth,
      isMobile: window.innerWidth < 428 ? true : false,
    };
  }, []);
  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getSize());
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [getSize]);

  return windowSize;
};

export default useWindowSize;
