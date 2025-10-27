import React, { useContext, useEffect, useState, lazy, act } from "react";
import { AuthContext } from "@dxc247/shared/contexts/AuthContext";
import { useSelector } from 'react-redux';

import { Link, useNavigate } from "react-router-dom";
import { SportsContext } from "@dxc247/shared/contexts/SportsContext";
import useSocketConnection from "@dxc247/shared/hooks/useSocketConnection";
import { getCurrentToken } from "@dxc247/shared/utils/Constants";
import { io } from "socket.io-client";
import encryptHybrid from "@dxc247/shared/utils/encryptHybrid";
import { decryptAndVerifyResponse } from "@dxc247/shared/utils/decryptAndVerifyResponse";
import useSportsData from "@dxc247/shared/hooks/useSportsData";
import useCommonData from "@dxc247/shared/hooks/useCommonData";

import { BackAndLayForSports } from "@dxc247/shared/utils/sportsUtils";


// Lazy load components for better performance
const Header = lazy(() => import("@dxc247/shared/components/layouts/Header"));
const SidebarLayout = lazy(() => import("@dxc247/shared/components/layouts/SidebarLayout"));
const Footer = lazy(() => import("@dxc247/shared/components/layouts/Footer"));
const SportsDataTable = lazy(() => import("@dxc247/shared/components/SportsDataTable"));
const NavTabs = lazy(() => import("@dxc247/shared/components/NavTabs"));

function Home() {

  const sportsMap  ={"4": "cricket", "2": "tennis", "3": "soccer"}
  
  const SPORT_ARRAY = {
    soccer: 1,
    cricket: 4,
    tennis: 2,
    football: 1,
  };
  
  const navigate = useNavigate();
  const { setShowLoader } = useContext(SportsContext);
  
  const token = getCurrentToken();
  
  // Get casino data from Redux instead of AuthContext
  const casinoList = useSelector(state => state.casino.casinoList);
  const { unAuthorizeHandle } = useContext(AuthContext);

  // Separate listData for each sport to prevent data mixing
  
  const [cricketData, setCricketData] = useState({});
  const [tennisData, setTennisData] = useState({});
  const [soccerData, setSoccerData] = useState({});

  // Socket connection for real-time data

  const [activeTab, setActiveTab] = useState("Cricket");
  
  // Call all 3 games at once at the beginning
  
 

  // Sequential data loading for all sports
  useEffect(() => {
    const loadAllSportsData = async () => {
      const sports = ["cricket", "tennis", "soccer"];
      
      for (const sport of sports) {
        try {
          // Create a temporary socket for this sport
          const tempSocket = io(import.meta.env.VITE_LIST_URL, {
            transports: ["websocket", "polling"],
            timeout: 10000,
            reconnection: false,
            forceNew: true,
          });

          // Set up one-time data listener
          const dataPromise = new Promise((resolve) => {
            const timeout = setTimeout(() => {
              tempSocket.disconnect();
              resolve(null);
            }, 5000); // 5 second timeout

            tempSocket.on("getListData", (userDatas) => {
              clearTimeout(timeout);
              tempSocket.disconnect();
              resolve(userDatas);
            });
          });

          // Set purpose for this sport
          const payload = {
            type: "list",
            game: SPORT_ARRAY[sport],
            match_ids: sport,
          };
          const encryptedPayload = encryptHybrid(payload);
          tempSocket.emit("setPurposeFor", encryptedPayload);

          // Wait for data or timeout
          const userDatas = await dataPromise;
          
          if (userDatas) {
            try {
              const parsedData = decryptAndVerifyResponse(userDatas);
              if (parsedData && Object.keys(parsedData).length > 0) {
                
                // Update the appropriate state
                if (sport === "cricket") {
                  setCricketData(parsedData.data);
                } else if (sport === "tennis") {
                  setTennisData(parsedData.data);
                } else if (sport === "soccer") {
                  setSoccerData(parsedData.data);
                }
              }
            } catch (error) {
              console.error(`Error parsing ${sport} data:`, error);
            }
          } else {
          }

          // Small delay between sports to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error loading ${sport} data:`, error);
        }
      }
    };

    loadAllSportsData();
  }, []); // Only run once on mount

  // Single socket connection for real-time updates of active sport
  useSocketConnection(
    activeTab.toLowerCase(),
    (data) => {
      // Update the appropriate state based on active tab
      if (activeTab === "Cricket") {
        setCricketData(data);
      } else if (activeTab === "Tennis") {
        setTennisData(data);
      } else if (activeTab === "Football") {
        setSoccerData(data);
      } 
    },
    import.meta.env.VITE_LIST_URL
  );



  const sportsTabs = [
    { name: "Cricket", dataOption: "cricketData", canonicalName: "Cricket" },
    { name: "Football", dataOption: "soccerData", canonicalName: "Soccer" },
    { name: "Tennis", dataOption: "tennisData", canonicalName: "Tennis" },
    { name: "Horse Racing", dataOption: "electionsData" ,canonicalName: "Horse Racing"    },
    { name: "Table Tennis", dataOption: "nowDataFound" ,canonicalName: "Table Tennis"},
    { name: "Basketball", dataOption: "nowDataFound" ,canonicalName: "Basketball"},
    { name: "Volleyball", dataOption: "nowDataFound" ,canonicalName: "Volleyball"},
    { name: "Snooker", dataOption: "electionsData" ,canonicalName: "Snooker"},
    { name: "Ice Hockey", dataOption: "electionsData" ,canonicalName: "Ice Hockey"},
    { name: "E Games", dataOption: "nowDataFound" ,canonicalName: "E Games"},
    { name: "Futsal", dataOption: "nowDataFound" ,canonicalName: "Futsal"},
    { name: "Handball", dataOption: "electionsData" ,canonicalName: "Handball"},
    { name: "Kabaddi", dataOption: "nowDataFound" },
    { name: "Wrestling", dataOption: "nowDataFound" },
    { name: "Badminton", dataOption: "nowDataFound" ,canonicalName: "Badminton"},
    { name: "Cycling", dataOption: "nowDataFound" },
    { name: "Motorbikes", dataOption: "nowDataFound" },
    { name: "Athletics", dataOption: "nowDataFound" },
    
    
  ];

  const { tennisList, soccerList, cricketList } = useSportsData(
    token,
    unAuthorizeHandle,
    navigate,
    true
  );

    
  const [commonData] = useCommonData(token, setShowLoader);

  // Filter sports tabs based on blocked sports with safety checks
  const filteredSportsTabs = React.useMemo(() => {
    try {
      if (!commonData || !Array.isArray(commonData.blocked_sports)) {
        return sportsTabs;
      }
      
      return sportsTabs.filter(sport => {
        if (!sport || !sport.name) return true;
        const blockedSports = commonData.blocked_sports || [];
        return !blockedSports.includes(sport.name.toUpperCase());
      });
    } catch (error) {
      console.error('Error filtering sports tabs:', error);
      return sportsTabs; // Return original list if filtering fails
    }
  }, [commonData, sportsTabs]);

  // If the current active tab is blocked, switch to the first available tab
  useEffect(() => {
    try {
      if (filteredSportsTabs && 
          Array.isArray(filteredSportsTabs) && 
          filteredSportsTabs.length > 0 && 
          activeTab && 
          !filteredSportsTabs.some(sport => sport && sport.name === activeTab)) {
        setActiveTab(filteredSportsTabs[0].name);
        
      }
    } catch (error) {
      console.error('Error setting active tab:', error);
    }
  }, [filteredSportsTabs, activeTab]);

  // Trigger data loading when active tab changes or when filtered tabs are updated
 

  // casinoList is now managed by Redux, no need for localStorage



  return (
    <div>
      <Header />

      <div className="main-container">
        <SidebarLayout />

        {/* Mobile Navigation Tabs */}
        <NavTabs />

        <div className="center-main-container home-page">
          <div className="center-container">
          <div className="latest-event d-none d-xl-flex">
            {!commonData ? (
              <div className="latest-event-item">
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>Loading latest events...</span>
                </div>
              </div>
            ) : commonData.latest_events && commonData.latest_events.length > 0 ? (
              commonData.latest_events.map((event, index) => (
                <div key={event.id || index} className="latest-event-item">
                  {sportsMap[event.sportId] ? (
                    <Link className="blink_me" to={`/${sportsMap[event.sportId]}/${event.id}`}>
                      <i className={`d-icon me-1 icon-${event.sportId}`}></i>
                      <span>{event.name}</span>
                    </Link>
                  ) : (
                    <div className="blink_me">
                      <i className={`d-icon me-1 icon-${event.sportId}`}></i>
                      <span>{event.name}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="latest-event-item">
                <span className="text-muted">No latest events available</span>
              </div>
            )}
          </div>
            <ul role="tablist" id="home-events" className="nav nav-pills sports-tab">
              {filteredSportsTabs && Array.isArray(filteredSportsTabs) ? filteredSportsTabs.map((sport, index) => {
                if (!sport || !sport.name) return null;
                return (
                  <li key={index} className="nav-item">
                    <span
                      data-toggle="tab"
                      data-option={sport.dataOption || ""}
                      onClick={() => sport.name && setActiveTab(sport.name)}
                      className={`nav-link ${
                        activeTab === sport.name ? "active" : ""
                      }`}
                    >
                      {sport.name}
                    </span>
                  </li>
                );
              }) : null}
            </ul>

            <div className="tab-content mt-1">
              <div className="tab-pane active">
                
                  <SportsDataTable
                    activeTab={activeTab}
                    sportList={
                      activeTab === "Cricket"
                        ? cricketList
                        : activeTab === "Tennis"
                        ? tennisList
                        : activeTab === "Football"
                        ? soccerList
                        : []
                    }
                    listData={
                      activeTab === "Cricket"
                        ? cricketData
                        : activeTab === "Tennis"
                        ? tennisData
                        : activeTab === "Football"
                        ? soccerData
                        : cricketData
                    }
                    BackAndLayForSports={BackAndLayForSports}
                  />
                
              </div>
            </div>

            <div className="home-products-container">
              <div className="row row5">
                <div className="col-md-12">
                  <div className="casino-list mt-2">
                    {casinoList.map((casino, index) => (
                      <div
                        className="casino-list-item position-relative"
                        key={index}
                      >
                        <Link
                          to={"casino/" + casino.match_id}
                          className="position-relative d-block"
                        >
                          <div
                            className="casino-list-item-banner"
                            style={{
                              backgroundImage: `url(${casino.casino_image})`,
                            }}
                          ></div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
