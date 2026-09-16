import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Client-side navigation to a route with a #hash (e.g. from another page to
// "/#books") doesn't scroll to the target element on its own — React Router
// only swaps the page. This scrolls to it once the destination has mounted.
const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const timeout = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
    return () => clearTimeout(timeout);
  }, [pathname, hash]);

  return null;
};

export default ScrollToHash;
