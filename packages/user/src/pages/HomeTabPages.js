import {useContext, useEffect, useState, lazy} from "react";
import { useSelector } from "react-redux";
import {AuthContext} from "@dxc247/shared/contexts/AuthContext";
import {CommonContext} from "@dxc247/shared/contexts/CommonContext";
import {Link, useNavigate, useParams} from "react-router-dom";
import {SportsContext} from "@dxc247/shared/contexts/SportsContext";
import useSocketConnection from "@dxc247/shared/hooks/useSocketConnection";
import useSportsData from "@dxc247/shared/hooks/useSportsData";
import { BackAndLayForSports } from "@dxc247/shared/utils/sportsUtils";
import Loader from "@dxc247/shared/components/Loader";

// Lazy load components for better performance
const Header = lazy(() => import("@dxc247/shared/components/layouts/Header"));
const SidebarLayout = lazy(() => import("@dxc247/shared/components/layouts/SidebarLayout"));
const Footer = lazy(() => import("@dxc247/shared/components/layouts/Footer"));
const SportsDataTable = lazy(() => import("@dxc247/shared/components/SportsDataTable"));
const NavTabs = lazy(() => import("@dxc247/shared/components/NavTabs"));

function HomeTabPages() {
    const navigate = useNavigate();

    const {match} = useParams()

    const token = useSelector(state => state.user.token);
    
    // Get casino data from Redux instead of AuthContext
    const casinoList = useSelector(state => state.casino.casinoList);
    const { unAuthorizeHandle } = useContext(AuthContext);
    
    const [listData, setListData] = useState({});

    function formatBasedOnHyphen(str) {
        // Split the string by hyphen, capitalize the first letter of each word, and join them back with a space
        return str.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    
    useSocketConnection(match, setListData, 'wss://react.dxc247.com:4005');

    // Socket connection for real-time data

    const { tennisList, soccerList, cricketList } = useSportsData(token, unAuthorizeHandle, navigate, true);

    const lists = {
        cricket: cricketList,
        tennis: tennisList,
        soccer: soccerList
    };

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
                                            sportList={lists[match] || []}
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