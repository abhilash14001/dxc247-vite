import { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import SidebarLayout from "./SidebarLayout";
import RightSideBarSports from "./RightSideBarSports";
import Footer from "./Footer";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";

const CommonLayout = ({
  children,
  props,
  showSportsRightSidebar = false,
  sportsProps = {},
}) => {
  const location = useLocation();
  
  // Check if current route is admin route
  const isAdminRoute = location.pathname.toLowerCase().startsWith(ADMIN_BASE_PATH);

  // CSS loading function with useCallback
  const loadAdminCSS = useCallback(() => {
    console.log('Loading CSS for admin sports route');

    // Load main style.css
    // if (!document.getElementById("admin-sports-style")) {
    //   const styleLink = document.createElement("link");
    //   styleLink.rel = "stylesheet";
    //   styleLink.href = "/assets/css/style.css";
    //   styleLink.id = "admin-sports-style";
    //   styleLink.onload = () => console.log('admin-sports-style CSS loaded successfully');
    //   styleLink.onerror = () => console.error('Failed to load admin-sports-style CSS');
    //   document.head.appendChild(styleLink);
      
    // }

    // Load responsive.css
    if (!document.getElementById("admin-sports-responsive")) {
      const responsiveLink = document.createElement("link");
      responsiveLink.rel = "stylesheet";
      responsiveLink.href = "/assets/css/responsive.css";
      responsiveLink.id = "admin-sports-responsive";
      responsiveLink.onload = () => console.log('admin-sports-responsive CSS loaded successfully');
      responsiveLink.onerror = () => console.error('Failed to load admin-sports-responsive CSS');
      document.head.appendChild(responsiveLink);
      console.log('Added admin-sports-responsive CSS');
    }
  }, []);

  // Load CSS when component mounts or route changes
  useEffect(() => {
    if (isAdminRoute) {
      // Add a small delay to ensure other CSS management systems have run first
      const timeoutId = setTimeout(() => {
        loadAdminCSS();
      }, 100);

      // Cleanup on unmount or route change
      return () => {
        clearTimeout(timeoutId);
        const existingStyleLink = document.getElementById("admin-sports-style");
        const existingResponsiveLink = document.getElementById("admin-sports-responsive");
        if (existingStyleLink) {
          existingStyleLink.remove();
        }
        if (existingResponsiveLink) {
          existingResponsiveLink.remove();
        }
      };
    }
  }, [isAdminRoute, loadAdminCSS]);

  if (isAdminRoute) {
    return (
      <div className="wrapper">
        <div className="main-container">
          <div
            className={`center-main-container ${
              props?.className || "detail-page"
            }`}
          >
            <div className="center-container">{children}</div>

            {/* Conditionally render RightSideBarSports only when needed */}
            {showSportsRightSidebar && <RightSideBarSports {...sportsProps} />}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="wrapper">
      <Header />

      <div className="main-container">
        <SidebarLayout />

        <div
          className={`center-main-container ${
            props?.className || "detail-page"
          }`}
        >
          <div className="center-container">{children}</div>

          {/* Conditionally render RightSideBarSports only when needed */}
          {showSportsRightSidebar && <RightSideBarSports {...sportsProps} />}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default CommonLayout;
