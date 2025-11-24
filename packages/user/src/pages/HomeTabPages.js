import {useContext, useEffect, useState, lazy} from "react";
import { useSelector } from "react-redux";
import {AuthContext} from "@dxc247/shared/contexts/AuthContext";
import {CommonContext} from "@dxc247/shared/contexts/CommonContext";
import {Link, useNavigate, useParams} from "react-router-dom";
import useSocketConnection from "@dxc247/shared/hooks/useSocketConnection";
import { BackAndLayForSports } from "@dxc247/shared/utils/sportsUtils";
import { io } from "socket.io-client";
import encryptHybrid from "@dxc247/shared/utils/encryptHybrid";
import { decryptAndVerifyResponse } from "@dxc247/shared/utils/decryptAndVerifyResponse";


// Lazy load components for better performance
const Header = lazy(() => import("@dxc247/shared/components/layouts/Header"));
const SidebarLayout = lazy(() => import("@dxc247/shared/components/layouts/SidebarLayout"));
const Footer = lazy(() => import("@dxc247/shared/components/layouts/Footer"));
const SportsDataTable = lazy(() => import("@dxc247/shared/components/SportsDataTable"));
const NavTabs = lazy(() => import("@dxc247/shared/components/NavTabs"));

function HomeTabPages() {

    const {match} = useParams()
    
    const [listData, setListData] = useState({});

    const SPORT_ARRAY = {
        soccer: 1,
        cricket: 4,
        tennis: 2,
        football: 1,
    };

    // Map route parameter to sport name (e.g., "table-tennis" -> "tennis")
    const normalizeSportName = (sportName) => {
        if (!sportName) return null;
        const normalized = sportName.toLowerCase().replace(/-/g, '');
        const sportMap = {
            'tabletennis': 'tennis',
            'table_tennis': 'tennis',
            'football': 'soccer',
            'soccer': 'soccer',
            'cricket': 'cricket',
            'tennis': 'tennis'
        };
        return sportMap[normalized] || normalized;
    };

    const normalizedMatch = normalizeSportName(match);

    function formatBasedOnHyphen(str) {
        // Split the string by hyphen, capitalize the first letter of each word, and join them back with a space
        return str.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    // Load initial data for the sport (same pattern as Home.js)
    useEffect(() => {
        const loadSportData = async () => {
            if (!normalizedMatch || !SPORT_ARRAY[normalizedMatch]) {
                console.warn(`[HomeTabPages] Sport "${normalizedMatch}" (from route "${match}") not found in SPORT_ARRAY`);
                return;
            }

            const socketUrl = import.meta.env.VITE_LIST_URL || 'wss://react.dxc247.com:4005';
            
            try {
                // Create a temporary socket for initial data load
                const tempSocket = io(socketUrl, {
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
                    game: SPORT_ARRAY[normalizedMatch],
                    match_ids: normalizedMatch,
                };
                const encryptedPayload = encryptHybrid(payload);
                tempSocket.emit("setPurposeFor", encryptedPayload);

                // Wait for data or timeout
                const userDatas = await dataPromise;
                
                if (userDatas) {
                    try {
                        const parsedData = decryptAndVerifyResponse(userDatas);
                        if (parsedData && Object.keys(parsedData).length > 0) {
                            setListData(parsedData.data);
                        }
                    } catch (error) {
                        console.error(`[HomeTabPages] Error parsing ${normalizedMatch} data:`, error);
                    }
                } else {
                    console.warn(`[HomeTabPages] No data received for ${normalizedMatch} within timeout`);
                }
            } catch (error) {
                console.error(`[HomeTabPages] Error loading ${normalizedMatch} data:`, error);
            }
        };

        if (normalizedMatch) {
            loadSportData();
        }
    }, [normalizedMatch, match]);

    // Socket connection for real-time updates
    useSocketConnection(normalizedMatch, setListData, import.meta.env.VITE_LIST_URL || 'wss://react.dxc247.com:4005');


    const { formatDateTime } = useContext(CommonContext);

    // casinoList is now managed by Redux, no need for localStorage

    return (
        <div>
            <Header/>

            <div className="main-container">
                <SidebarLayout/>
                <NavTabs />
                <div className="center-main-container home-page">
                    {/* <div className="latest-event d-xl-flex">
                    </div> */}

                    <div className="d-block w-100">
                        <div>
                            <ul role="tablist" id="home-events" className="nav nav-pills">
                                <li className="nav-item"><span data-toggle="tab"
                                                            data-option="cricketData"
                                                            className="sport-nav nav-link active">{formatBasedOnHyphen(match)}</span>
                                </li>
                            </ul>

                            <div className="tab-content">
                                <div className="tab-pane active">
                                    <div className="coupon-card coupon-card-first">
                                        <SportsDataTable
                                            activeTab={formatBasedOnHyphen(match)}
                                            listData={listData}
                                            BackAndLayForSports={BackAndLayForSports}
                                            isHomeTabPages={true}
                                            matchParam={match}
                                            formatDateTime={formatDateTime}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}


export default HomeTabPages;