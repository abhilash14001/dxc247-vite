import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  Suspense,
  lazy,
} from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getCurrentToken } from "../../utils/Constants";
import { Link, useParams } from "react-router-dom";
import AfterLoginPopup from "../AfterLoginPopup";
import DesktopRulesModal from "../DesktopRulesModal";
import EditStakeModal from "../EditStakeModal";
import { createPopper } from "@popperjs/core";

import { useDispatch, useSelector } from "react-redux";
import { setShowModal } from "../../store/slices/userSlice";
import useCommonData from "../../hooks/useCommonData";

// Lazy load CurrentBetModal for better performance
const CurrentBetModal = lazy(() => import("../CurrentBetModal"));

function Header() {
  const dropdownRef = useRef(""); // Ref for the desktop dropdown
  const mobileDropdownRef = useRef(""); // Ref for the mobile dropdown
  const desktopToggleRef = useRef(""); // Ref for desktop toggle button
  const mobileToggleRef = useRef(""); // Ref for mobile toggle button
  const desktopMenuRef = useRef(""); // Ref for desktop menu
  const mobileMenuRef = useRef(""); // Ref for mobile menu
  const desktopPopperRef = useRef(null); // Popper instance for desktop
  const mobilePopperRef = useRef(null); // Popper instance for mobile
  const dispatch = useDispatch();
  const [currentBetModalOpen, setCurrentBetModalOpen] = useState(false);

  // Get common data for blocking
  const [commonData] = useCommonData();

  // Get live mode data for logo
  const { liveModeData } = useSelector((state) => state.commonData);
  const { user: userData, showModal } = useSelector((state) => state.user);

  // Local state for UI visibility controls
  const [showBalance, setShowBalance] = useState(true);
  const [showExposure, setShowExposure] = useState(true);

  // Check if sport is blocked
  const isSportBlocked = (sportName) => {
    try {
      const blockedSports = commonData?.blocked_sports || [];
      return blockedSports.includes(sportName.toUpperCase());
    } catch (error) {
      console.error("Error checking blocked sport:", error);
      return false;
    }
  };

  // Check if casino is blocked
  const isCasinoBlocked = (casinoName) => {
    try {
      const blockedCasinos = commonData?.blocked_casinos || [];
      return blockedCasinos.includes(casinoName.toLowerCase());
    } catch (error) {
      console.error("Error checking blocked casino:", error);
      return false;
    }
  };

  // Sports navigation data
  const sportsNavItems = [
    { name: "Cricket", path: "/game-list/cricket" },
    { name: "Tennis", path: "/game-list/tennis" },
    { name: "Football", path: "/game-list/soccer" },
    { name: "Table Tennis", path: "/game-list/table-tennis" },
  ];

  // Casino navigation data
  const casinoNavItems = [
    { name: "Baccarat", path: "/casino/baccarat", key: "baccarat" },
    { name: "32 Cards", path: "/casino/card32", key: "card32" },
    { name: "Teenpatti", path: "/casino/teen20", key: "teen20" },
    { name: "Poker", path: "/casino/poker", key: "poker" },
    { name: "Lucky 7", path: "/casino/lucky7", key: "lucky7" },
  ];

  const { match } = useParams();
  const { userBalance, exposure, setIsLoggedIn, logout, getCricketList } =
    useContext(AuthContext);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      // Close desktop dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setisDropdownOpen(false);
      }

      // Close mobile dropdown if clicked outside
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsMobileDropdownOpen(false);
      }
    };

    const handleResize = () => {
      // Close both dropdowns when window is resized to prevent conflicts
      setisDropdownOpen(false);
      setIsMobileDropdownOpen(false);
    };

    // Add event listeners on mount
    document.addEventListener("click", handleDocumentClick);
    window.addEventListener("resize", handleResize);

    // Cleanup the event listeners and Popper instances on component unmount
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      window.removeEventListener("resize", handleResize);

      // Cleanup Popper instances
      if (desktopPopperRef.current) {
        desktopPopperRef.current.destroy();
      }
      if (mobilePopperRef.current) {
        mobilePopperRef.current.destroy();
      }
    };
  }, []);

  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    const newState = !isDropdownOpen;
    setisDropdownOpen(newState);

    if (newState && desktopToggleRef.current && desktopMenuRef.current) {
      // Create Popper instance for desktop dropdown
      if (desktopPopperRef.current) {
        desktopPopperRef.current.destroy();
      }
      desktopPopperRef.current = createPopper(
        desktopToggleRef.current,
        desktopMenuRef.current,
        {
          placement: "bottom-end",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ],
        }
      );
    } else if (!newState && desktopPopperRef.current) {
      desktopPopperRef.current.destroy();
      desktopPopperRef.current = null;
    }
  };

  const toggleMobileDropdown = () => {
    const newState = !isMobileDropdownOpen;
    setIsMobileDropdownOpen(newState);

    if (newState && mobileToggleRef.current && mobileMenuRef.current) {
      // Create Popper instance for mobile dropdown
      if (mobilePopperRef.current) {
        mobilePopperRef.current.destroy();
      }
      mobilePopperRef.current = createPopper(
        mobileToggleRef.current,
        mobileMenuRef.current,
        {
          placement: "bottom-start",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ],
        }
      );
    } else if (!newState && mobilePopperRef.current) {
      mobilePopperRef.current.destroy();
      mobilePopperRef.current = null;
    }
  };

  const handleLogout = () => {
    logout();
  };

  const toggleModal = () => {
    dispatch(setShowModal(false));
  };

  const [ruleModal, setRuleModal] = useState(false);
  const [stakeModal, setStakeModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const showStakePopup = () => {
    setStakeModal(!stakeModal);
  };

  const handleRuleModalClose = () => {
    setRuleModal(!ruleModal);
  };

  const handleShowBalanceChange = (checked) => {
    setShowBalance(checked);
  };

  const handleShowExposureChange = (checked) => {
    setShowExposure(checked);
  };

  return (
    <>
      <section className="header">
        <DesktopRulesModal
          showModal={ruleModal}
          handleClose={handleRuleModalClose}
        />
        {showModal && (
          <AfterLoginPopup onClose={toggleModal} show={showModal} />
        )}
        <EditStakeModal handleClose={showStakePopup} show={stakeModal} />

        <div className="header-top">
          <div className="logo-header">
            <Link to="/" className="d-xl-none">
              <i className="fas fa-home me-1"></i>
            </Link>
            <Link to="/">
              <img
                src={liveModeData?.logo || "../img/logo.png"}
                alt={liveModeData?.site_name || "Logo"}
              />
            </Link>
          </div>
          <div className="user-details">
            <div className="search-box-container d-none d-xl-block">
              <div className="search-box">
                <input
                  type="search"
                  placeholder="Search here"
                  className="form-control"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <a>
                  <i className="fas fa-search-plus"></i>
                </a>
              </div>
            </div>
            <div className="header-rules ms-3">
              <div>
                <a
                  className="rules-link pointer"
                  onClick={handleRuleModalClose}
                >
                  <b>Rules</b>
                </a>
              </div>
            </div>
            <div className="user-balance ms-1 ms-xl-3">
              {showBalance && (
                <div>
                  <span>Balance:</span>
                  <b>{userBalance}</b>
                </div>
              )}
              <div>
                {showExposure && (
                  <>
                    <span onClick={() => setCurrentBetModalOpen(true)}>
                      Exp:
                    </span>
                    <b
                      className="pointer"
                      onClick={() => setCurrentBetModalOpen(true)}
                    >
                      {exposure}
                    </b>
                  </>
                )}

                <div
                  className={`dropdown ${isMobileDropdownOpen ? "show" : ""}`}
                  ref={mobileDropdownRef}
                >
                  <a
                    ref={mobileToggleRef}
                    className={`user-name ms-1 ms-xl-3 d-inline-block d-xl-none dropdown-toggle ${
                      isMobileDropdownOpen ? "show" : ""
                    }`}
                    id="react-aria7920988421-:r0:"
                    aria-expanded={isMobileDropdownOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMobileDropdown();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {userData && userData.is_demo === 0
                      ? userData.username.toUpperCase()
                      : userData.name}
                    <i className="fas fa-chevron-down ms-1"></i>
                  </a>
                  <ul
                    ref={mobileMenuRef}
                    aria-labelledby="react-aria7920988421-:r0:"
                    className={`dropdown-menu ${
                      isMobileDropdownOpen ? "show" : ""
                    }`}
                  >
                    <Link to="/account-statement">
                      <li data-rr-ui-dropdown-item="" className="dropdown-item">
                        Account Statement
                      </li>
                    </Link>
                    <Link to="/current-bets">
                      <li data-rr-ui-dropdown-item="" className="dropdown-item">
                        Current Bets
                      </li>
                    </Link>
                    <Link to="/bet-history">
                      <li data-rr-ui-dropdown-item="" className="dropdown-item">
                        Bet History
                      </li>
                    </Link>

                    <a>
                      <li className="dropdown-item" onClick={showStakePopup}>
                        Set Button Values
                      </li>
                    </a>
                    <a className="d-xl-none">
                      <li className="dropdown-item">Rules</li>
                    </a>
                    <a className="dropdown-item d-xl-none">
                      Balance
                      <div className="form-check float-end">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={showBalance}
                          onChange={(e) =>
                            handleShowBalanceChange(e.target.checked)
                          }
                        />
                      </div>
                    </a>
                    <a className="dropdown-item d-xl-none">
                      Exposure
                      <div className="form-check float-end">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={showExposure}
                          onChange={(e) =>
                            handleShowExposureChange(e.target.checked)
                          }
                        />
                      </div>
                    </a>
                    <hr className="dropdown-divider" role="separator" />
                    <li
                      data-rr-ui-dropdown-item=""
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      SignOut
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              className={`dropdown ${isDropdownOpen ? "show" : ""}`}
              ref={dropdownRef}
            >
              <a
                ref={desktopToggleRef}
                className={`user-name ms-3 d-none d-xl-block dropdown-toggle ${
                  isDropdownOpen ? "show" : ""
                }`}
                id="react-aria7920988421-:r1:"
                aria-expanded={isDropdownOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown();
                }}
                style={{ cursor: "pointer" }}
              >
                {userData && userData.is_demo === 0
                  ? userData.username.toUpperCase()
                  : userData.name}
                <i className="fas fa-chevron-down ms-1"></i>
              </a>
              <ul
                ref={desktopMenuRef}
                aria-labelledby="react-aria7920988421-:r1:"
                className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
              >
                <Link to="/account-statement">
                  <li data-rr-ui-dropdown-item="" className="dropdown-item">
                    Account Statement
                  </li>
                </Link>

                <Link to="/current-bets">
                  <li data-rr-ui-dropdown-item="" className="dropdown-item">
                    Current Bets
                  </li>
                </Link>
                <Link to="/bet-history">
                  <li data-rr-ui-dropdown-item="" className="dropdown-item">
                    Bet History
                  </li>
                </Link>

                <a>
                  <li className="dropdown-item" onClick={showStakePopup}>
                    Set Button Values
                  </li>
                </a>
                <a className="d-xl-none">
                  <li className="dropdown-item">Rules</li>
                </a>
                <a className="dropdown-item d-xl-none">
                  Balance
                  <div className="form-check float-end">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={showBalance}
                      onChange={(e) =>
                        handleShowBalanceChange(e.target.checked)
                      }
                    />
                  </div>
                </a>
                <a className="dropdown-item d-xl-none">
                  Exposure
                  <div className="form-check float-end">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={showExposure}
                      onChange={(e) =>
                        handleShowExposureChange(e.target.checked)
                      }
                    />
                  </div>
                </a>
                <hr className="dropdown-divider" role="separator" />
                <li
                  data-rr-ui-dropdown-item=""
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  SignOut
                </li>
              </ul>
            </div>
          </div>
          <div className="news d-none d-xl-block">
            <div className="scrolling-text">
            <marquee >💥 Luck's on fire—go scratch higher!🎉Wickets fall, jackpots call – Asia Cup magic beats them all! 🌟🏏</marquee>
            
            </div>
          </div>
        </div>
        <div className="header-bottom d-none d-xl-block">
          <nav className="navbar navbar-expand">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              {sportsNavItems.map(
                (sport, index) =>
                  !isSportBlocked(sport.name) && (
                    <li key={index} className="nav-item">
                      <Link className="nav-link" to={sport.path}>
                        {sport.name}
                      </Link>
                    </li>
                  )
              )}
              {casinoNavItems.map(
                (casino, index) =>
                  !isCasinoBlocked(casino.key) && (
                    <li key={index} className="nav-item">
                      <Link className="nav-link" to={casino.path}>
                        {casino.name}
                      </Link>
                    </li>
                  )
              )}
              <li className="nav-item aviator">
                <Link className="nav-link" to="/aviator-list">
                  <svg
                    id="Layer_2"
                    data-name="Layer 2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 457.6 277.4"
                  >
                    <defs>
                      <style>{`.cls-1 { fill: #e40539; }`}</style>
                    </defs>
                    <g id="Layer_1-2" data-name="Layer 1">
                      <g>
                        <path
                          className="cls-1"
                          d="M61.85,273.4c-1.8-3.5-2.3-3.9-4-3-3.2,1.7-5.5,1.1-9-2.5l-3.3-3.4,4.4-1.9c2.4-1.1,8-2.2,12.4-2.6,27.1-2.5,84.1-19.2,161-47.1,32.1-11.7,80.4-30.1,81.3-31,1.2-1.2-1-1.5-11.9-1.7-10.6-.2-11.7,0-16.5,2.4-13.1,6.8-74.6,31.2-92.8,36.7l-6.9,2.1-6.4-5-6.5-4.9-3.6,1.5c-21.3,9-88,36.4-89.2,36.6-1,.2-1.6-.6-1.8-2.3-.3-2.4.5-3,7.8-6.9,4.5-2.3,7.9-4.5,7.5-4.8-.3-.4-4.3-.9-8.9-1.3-9.7-.8-17.3-4-28.2-11.9-4.8-3.5-7.8-5-10-5-4.3,0-6.4.9-6.4,2.7,0,.8,6.8,8.7,15.1,17.6,13,13.7,14.9,16.2,13.3,16.8-3.7,1.5-4.8.8-16.3-10.3-6.4-6.2-14.6-14.2-18.3-17.7l-6.7-6.5-8.8,4.2-8.8,4.2-.3-3.4c-.2-2,.2-4.4.8-5.5s6.5-4.8,13.1-8.2c11.8-6,14.2-8,12.2-10-.7-.7-4.1.5-10.2,3.5l-9.1,4.6v-2.5c0-2,1.4-3.3,7.7-7,10.3-6,17.3-8.1,22.3-6.6,2.1.6,10.7,6.3,19.1,12.6,19,14.3,29.4,19.9,35.9,19.2,5.3-.5,34-13.7,61.9-28.5,18.3-9.7,21.6-12.1,19.5-14.2-.7-.7-7.1,1.8-21.4,8.5-14.7,7-20.5,9.3-21.1,8.4-1.2-2-.1-3.3,5.6-6.3,3-1.6,5.5-3.4,5.5-4,0-.7-1.3-2.5-2.8-4l-2.9-2.7-19.8,9.6c-10.9,5.2-20,9.3-20.2,9.1-.8-.7,2.5-12.8,3.8-14.1.8-.8,9.5-5.6,19.4-10.8,17.7-9.4,18-9.6,17.8-12.7,0-1.7-.4-3.4-.7-3.7s-3.9.9-8,2.7l-7.4,3.3-8.9-9.3c-4.8-5.1-8.9-9.6-9.1-10-.5-1.4,8.8-7.9,14.6-10.1,10.4-4,10.9-3.9,118.5,11.3,35.6,5,65.5,9.7,66.5,10.4,1.6,1.1,1.6,1.4-.1,4.8l-1.7,3.7,2.8,1c1.5.5,5.8,2.1,9.5,3.6l6.9,2.5,10.1-4.3c12.4-5.2,32.9-15.6,45.6-23.2l9.4-5.5,3.2,2.4c3.2,2.4,6.9,3.1,7.9,1.6.3-.5-2.5-6.9-6.3-14.3-3.7-7.4-8.7-18.4-11-24.4-2.4-6.1-4.8-11.6-5.4-12.4-.9-1-3.3-1.2-10.7-.8-10.8.5-18.1,2.6-42,12-15.4,6-67.7,31.5-70.6,34.4-1.3,1.4-3.4,1.4-19.2-.1-9.7-.9-18-1.6-18.4-1.6-1.4,0-.8-5.5,1.1-9.7,1.6-3.4,3.9-5.4,14-12.1,14.3-9.5,28.2-16.5,37.4-18.9l6.5-1.7,9.9,3.9c14.3,5.6,16.3,5.6,39.8-1,38.2-10.6,43.5-11.8,52.2-11.9,8-.1,8.3,0,11.6,3.3,2.6,2.5,5.7,8.3,12,23,4.7,10.8,9,21.3,9.7,23.5,1.7,5.4.8,11.9-2.4,16-6.7,8.8-38,25.2-82.1,42.8-22.8,9.1-61.8,21.9-162.5,53.3-31.1,9.7-64.7,20.3-74.6,23.6-10,3.2-18.9,5.9-19.8,5.9-.8,0-2.5-1.8-3.6-4ZM291.35,168.4c3.8-2.3,7.1-6.9,5.8-8-.6-.5-144.9-20.8-158.8-22.3-1.2-.1-2,.4-2,1.3,0,1.2,15.5,4.6,72,16.1,39.6,8.1,73.7,14.7,75.9,14.8,2.3.1,5.2-.7,7.1-1.9h0ZM247.65,122c4.2-2.3,11.2-5.8,15.4-7.7,4.3-1.9,7.8-3.7,7.8-4.1s-2.8-1.3-6.2-2c-7.7-1.7-13.7-.9-22.4,3.3-6.7,3.1-18.9,11.7-18.1,12.6.6.5,9.3,1.9,13.5,2.2,1.3,0,5.8-1.9,10-4.3h0ZM282.15,115.8c7.5-3.8,10.7-6,10.5-7.1-.4-2.1-18.3-9.2-23.4-9.3-2.2,0-4.9.6-6,1.4q-2.1,1.6,10.4,6.5c2.6,1,4.8,2.3,5,2.9s-1.9,2.2-4.7,3.6c-5.5,2.8-6.6,4-5.7,6.1.8,2.3,2.3,1.9,13.9-4.1h0Z"
                        ></path>
                        <path
                          className="cls-1"
                          d="M440.55,196.2c-6.8-10.1-13.5-20.3-14.9-22.8-1.5-2.5-5.5-14.1-9.1-25.7l-6.5-21.3,5.1-5c2.7-2.8,5.1-4.9,5.2-4.8.1.2,5.2,9.4,11.4,20.6,11.9,21.3,15.8,31,23.1,58,3.3,11.9,3.3,12.3,1.7,15.7-.9,1.9-2.1,3.5-2.6,3.5s-6.5-8.2-13.4-18.2h0ZM454.65,206.5c.2-1.9-.5-4.6-1.7-6.7-1.8-3.1-22-30.4-24.3-32.9-1.2-1.3-3,1.5-2.2,3.5,1.2,3.4,26,39.9,26.9,39.6.6-.1,1.1-1.7,1.3-3.5h0Z"
                        ></path>
                        <path
                          className="cls-1"
                          d="M295.35,148.3c-13.2-2.6-24.6-4.9-25.4-5.1-.8-.2,11.3-5.4,27-11.6l28.3-11.4,5.3,5.9c2.9,3.2,5.2,6.3,5.3,6.9,0,.6-2.3,5.5-5.1,10.8-4.8,9.1-5.2,9.6-8.2,9.5-1.8-.1-14-2.3-27.2-5h0Z"
                        ></path>
                        <path
                          className="cls-1"
                          d="M334.85,152.1c0-.2,1.6-3.6,3.6-7.5,1.9-4,4.1-9,4.9-11.1l1.3-3.8-5.3-6.9c-5.3-6.8-5.4-6.9-3.2-8.1,2-1.1,2.6-.8,6.2,3.2,2.2,2.5,4.3,4.5,4.6,4.5s1.7-3.9,3-8.7l2.4-8.8.3,4.9c.2,2.6-.2,8-.8,11.8l-1,7,5.1,6.4,5.1,6.4-2.7,1c-2.2.9-2.9.6-5-1.8-1.3-1.5-2.5-3-2.5-3.4-.1-2.3-1.9-.1-3.9,4.6-1.2,3-2.8,5.9-3.5,6.5-1.4,1.1-8.6,4.3-8.6,3.8h0Z"
                        ></path>
                        <path
                          className="cls-1"
                          d="M404.75,114.7c-7.2-16.1-7.3-16.4-5.8-17.5,1.5-1,21.2-.4,24.2.7.9.4,1.7,1.4,1.7,2.2,0,4.2-12.6,21.3-15.6,21.3-.9,0-2.8-2.9-4.5-6.7h0ZM414.15,104.7c4.8-2,8.7-4,8.7-4.4,0-1.2-4.4-1.9-13.2-1.9-8.2,0-8.8.1-8.8,2,0,2.4,2.7,8,3.8,8,.4,0,4.6-1.6,9.5-3.7Z"
                        ></path>
                        <path
                          className="cls-1"
                          d="M385.05,75.9c-10.7-19.1-14-27.3-20.7-51.6-4-14.3-4.3-18.7-1.6-22l1.9-2.3,14.8,22.3,14.8,22.3,7.6,24.2c4.2,13.2,7.4,24.2,7.1,24.3-.3.1-3.5.3-7.1.6l-6.5.4-10.3-18.2h0ZM391.85,46.5c0-1.5-23.2-37.5-26.1-40.6-1.3-1.3-2.9,1.2-2.9,4.7,0,2.5,8.8,15.4,22.3,32.7,4.6,6,6.7,7,6.7,3.2Z"
                        ></path>
                      </g>
                    </g>
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <Suspense fallback={<div></div>}>
        <CurrentBetModal
          isOpen={currentBetModalOpen}
          onClose={setCurrentBetModalOpen}
          dialogclassName="modal-xl"
        />
      </Suspense>
    </>
  );
}

export default Header;
