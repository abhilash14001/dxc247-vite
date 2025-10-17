import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosFetch from "../../utils/Constants";
import { SportsContext } from "../../contexts/SportsContext";
import useCommonData from "../../hooks/useCommonData";

const SidebarLayout = () => {
    const token = useSelector(state => state.user.token);
    const { setShowLoader } = useContext(SportsContext);
    const {
        activeLink,
        navLinks,
        setNavLinks
    } = useContext(SportsContext)

    const [allSportShow, setAllSportShow] = useState({ racing: true, others: true, allsports: true })
    const [matchesData] = useCommonData(token, setShowLoader);
    

    useEffect(() => {
        
        
        // Only run when matchesData is available and has sidebar_data
        if (!matchesData || !matchesData.sidebar_data) {
            
            return;
        }
        
        

        const getData = async () => {
            try {
                const all_promise = matchesData.sidebar_data;
                
                
                
                if (Array.isArray(all_promise)) {
                    // Group by game_id
                    const gameGroups = {};
                    
                    all_promise.forEach((item) => {
                        
                        
                        if (item && item.game_id) {
                            if (!gameGroups[item.game_id]) {
                                gameGroups[item.game_id] = [];
                            }
                            
                            // Add match details to the game group
                            // The match data is directly in the item object
                            gameGroups[item.game_id].push({
                                match_name: item.match_name,
                                match_id: item.match_id
                            });
                        }
                    });
                    
                    
                    
                    // Update navLinks with grouped data
                    setNavLinks((prevState) => {
                        const newState = { ...prevState };
                        
                        // Map game_id to sport names
                        const gameIdToSport = {
                            '1': 'Cricket',
                            '2': 'Tennis', 
                            '3': 'Football'
                            // Add more mappings as needed
                        };
                        
                        // Update each sport with its matches
                        Object.keys(gameGroups).forEach(gameId => {
                            const sportName = gameIdToSport[gameId] || `Game_${gameId}`;
                            newState[sportName] = {
                                ...newState[sportName],
                                list: gameGroups[gameId]
                            };
                        });
                        
                        return newState;
                    });
                }
            } catch (error) {
                console.error('Error processing sidebar data:', error);
            }
        };

        getData();

    }, [matchesData, setNavLinks]); // Add matchesData as dependency

    

    return (
        <>
            <div className="sidebar left-sidebar">
                <div className="accordion">
                    <div className="accordion-item">
                        <h2 className="sidebar-title accordion-header">
                            <button 
                                type="button" 
                                aria-expanded={allSportShow.racing} 
                                className={`accordion-button ${!allSportShow.racing ? 'collapsed' : ''}`}
                                onClick={() => setAllSportShow({ ...allSportShow, racing: !allSportShow.racing })}
                            >
                                Racing Sports
                            </button>
                        </h2>
                        <div className={`accordion-collapse collapse ${allSportShow.racing ? 'show' : ''}`}>
                            <div className="racing-sport accordion-body">
                                <ul>
                                    <div className="nav-item dropdown">
                                        <a id="horse-dropdown" aria-expanded="false" role="button" className="dropdown-toggle nav-link" tabIndex="0" href="#">
                                            Horse Racing
                                        </a>
                                    </div>
                                </ul>
                                <ul>
                                    <div className="nav-item dropdown">
                                        <a id="greyhound-dropdown" aria-expanded="false" role="button" className="dropdown-toggle nav-link" tabIndex="0" href="#">
                                            Greyhound Racing
                                        </a>
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion">
                    <div className="accordion-item">
                        <h2 className="sidebar-title accordion-header">
                            <button 
                                type="button" 
                                aria-expanded={allSportShow.others} 
                                className={`accordion-button ${!allSportShow.others ? 'collapsed' : ''}`}
                                onClick={() => setAllSportShow({ ...allSportShow, others: !allSportShow.others })}
                            >
                                Others
                            </button>
                        </h2>
                        <div className={`accordion-collapse collapse ${allSportShow.others ? 'show' : ''}`}>
                            <div className="other-casino-list accordion-body">
                                <ul>
                                    <li className="nav-item">
                                        <Link to="/slot-list" className="nav-link">
                                            <span>Slot Game</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/fantasy-list" className="nav-link">
                                            <span>Fantasy Game</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion">
                    <div className="accordion-item">
                        <h2 className="sidebar-title accordion-header">
                            <button 
                                type="button" 
                                aria-expanded={allSportShow.allsports} 
                                className={`accordion-button ${!allSportShow.allsports ? 'collapsed' : ''}`}
                                onClick={() => setAllSportShow({ ...allSportShow, allsports: !allSportShow.allsports })}
                            >
                                All Sports
                            </button>
                        </h2>
                        <div className={`accordion-collapse collapse ${allSportShow.allsports ? 'show' : ''}`}>
                            <div className="menu-box accordion-body">
                                {Object.entries(navLinks).map(([index, value], i) => {
                                    try {
                                        
                                        // Safety checks
                                        if (!index || !value) return null;
                                        
                                        // Check if the sport is blocked
                                        const blockedSports = matchesData?.blocked_sports || [];
                                        const isSportBlocked = Array.isArray(blockedSports) && blockedSports.includes(index.toUpperCase());
                                        
                                        // Don't render if sport is blocked
                                        if (isSportBlocked) {
                                            return null;
                                        }
                                    } catch (error) {
                                        console.error('Error checking blocked sports:', error);
                                        // Continue rendering if there's an error
                                    }
                                    
                                    return (
                                        <ul className="navbar-nav" key={i}>
                                            <li className="nav-item dropdown">
                                                <a 
                                                    className="dropdown-toggle nav-link"
                                                    onClick={() => activeLink(index)}
                                                >
                                                    <i className={`${value.active === false ? 'far fa-plus-square' : 'far fa-minus-square'} me-1`}></i>
                                                    <span>{index}</span>
                                                </a>
                                            <ul className={`dropdown-menu ${value.active === false ? '' : 'show'}`}>
                                                {Object.entries(value.list).map(([index1, value1], i1) => (
                                                    <li className="nav-item" key={i1}>
                                                        <Link 
                                                            to={"/" + value.canonical_name + "/" + value1.match_id}
                                                            className="dropdown-toggle nav-link"
                                                        >
                                                            <span>{value1.match_name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    </ul>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest Events Section */}
            <div className="latest-event d-xl-none">
                {!matchesData ? (
                    <div className="latest-event-item">
                        <span>Loading latest events...</span>
                    </div>
                ) : matchesData.latest_events && matchesData.latest_events.length > 0 ? (
                    matchesData.latest_events.map((event, index) => (
                        <div key={index} className="latest-event-item">
                            <a className="blink_me" href={`/game-details/${event.game_id}/${event.match_id}`}>
                                <i className={`d-icon icon-${event.game_id}`}></i>
                                <span>{event.match_name}</span>
                            </a>
                        </div>
                    ))
                ) : (
                    <div className="latest-event-item">
                        <span>No latest events available</span>
                    </div>
                )}
            </div>
        </>
    )

}
export default SidebarLayout