import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteChangeHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // This function will run every time the route changes
    handleNavigation();

    // Function to set data in local storage
    function handleNavigation() {
      localStorage.setItem("lastActivityTime", Date.now());

      // You can also perform other actions here, like analytics tracking, etc.
      console.log(`Navigated to ${location.pathname}`);
    }
  }, [location]); // Dependency array includes 'location' to trigger effect on route change

  return null;
};

export default RouteChangeHandler;
