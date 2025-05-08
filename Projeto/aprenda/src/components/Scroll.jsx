import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Scroll = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // ou "auto" se não quiser animação
    });
  }, [pathname]);

  return null;
};

export default Scroll;
