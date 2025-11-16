import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SportsContext } from '@dxc247/shared/contexts/SportsContext';
import { AuthContext } from '@dxc247/shared/contexts/AuthContext';
import AdminRouteGuard from '../components/AdminRouteGuard';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { hasPermission } from '../utils/permissionUtils';
import useAdminPasswordMiddleware from '@dxc247/shared/components/middleware/AdminPasswordMiddleware';
import AdminPasswordModal from '@dxc247/shared/components/ui/AdminPasswordModal';
import useCommonData from "@dxc247/shared/hooks/useCommonData";

const AdminLayout = ({ children }) => {
  

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { user: adminUser, token, isAuthenticated } = useSelector(state => state.admin);
  const { logout } = useContext(AuthContext);
  
  // Check if user has role 6 (admin role)
  const isAdminRole = adminUser?.role === 6;
  const { liveModeData } = useSelector(state => state.commonData);
  const { navLinks, activeLink,setNavLinks } = useContext(SportsContext);
  
  const location = useLocation();
  const [matchesData] = useCommonData(token);
  
  // Admin password middleware for sub-admin access control
  const {
    showPasswordModal,
    password,
    setPassword,
    loading: passwordLoading,
    error: passwordError,
    handlePasswordSubmit,
    checkAccess,
    closeModal,
    clearError
  } = useAdminPasswordMiddleware();

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

    useEffect(() => {
      setSidebarOpen(false);
    }, []);
  // Simple menu configuration
  const mainMenuItems = [
    { path: '/users', label: 'List Of Clients', permission: 'client-list' },
    { path: '/', label: 'Market Analysis', permission: 'market-analysis' }
  ];

  const reportsMenuItems = [
    { path: '/reports/account-statement', label: 'Account Statement', permission: 'account-statement' },
    { path: '/reports/client-profit-loss', label: 'Client P L', permission: 'client-p-l' },
    { path: '/reports/sport-profit-loss', label: 'Sport P L', permission: 'sport-p-l' },
    { path: '/reports/profit-loss', label: 'Profit & Loss', permission: 'profit-loss' },
    { path: '/reports/match-pl', label: 'Match P L', permission: 'match-p-l' },
    { path: '/reports/current-bet', label: 'Current Bet', permission: 'current-bet' },
    { path: '/reports/bet-history', label: 'Bet History', permission: 'bet-history' },
    { path: '/reports/deleted-bet-history', label: 'Deleted Bet History', permission: 'deleted-bet-history' },
    { path: '/reports/casino-result', label: 'Casino Result', permission: 'casino-result' },
    { path: '/reports/line-market-bet-history', label: 'Line Market Bet History', permission: 'line-market-bet-history' }
  ];

  const settingsMenuItems = [
    { path: '/settings/sports-market', label: 'Sports Market', permission: 'sports-market' },
    { path: '/settings/casino-market', label: 'Casino Market', permission: 'setting-casino-market' },
    { path: '/settings/match-history', label: 'Match History', permission: 'match-history' },
    { path: '/settings/manage-fancy', label: 'Manage Fancy', permission: 'manage-fancy' },
    { path: '/settings/fancy-history', label: 'Fancy History', permission: 'fancy-history' },
    { path: '/settings/site-configuration', label: 'Site Configuration', permission: 'site-configuration' },
    { path: '/settings/multi-login', label: 'Multi Login Account', permission: 'manage-privilege' },
    { path: '/settings/manage-prefix', label: 'Manage Prefix', permission: 'manage-prefix' },
    { path: '/settings/block-market', label: 'Block Market', permission: 'block-market' },
    { path: '/settings/client-track', label: 'Client Track', permission: 'client-tack' },
    { path: '/settings/banner-manager', label: 'Banner Manager', permission: 'banner-manager' },
    { path: '/settings/block-ip', label: 'Block IP', permission: 'block-ip' }
  ];

  // Initialize pageReady and fetch logo when adminUser is available



  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };



  // Handle settings menu item clicks with password verification
  const handleSettingsMenuClick = (item) => {
        const targetRoute = item.path;
    checkAccess(adminUser, targetRoute);
  };

  return (
    <AdminRouteGuard>
      <div className="wrapper">
      {/* Main Content */}
      <div>
      {/* Header */}
      <header>
        <div className="admin-header-bottom">
          <div className="container-fluid">
            <Link to="/" className="logo">
              <img 
                src={liveModeData?.logo || 'https://admin.dmt77.com/uploads/sites_configuration/C3K6931720187871logo%20(1).png'} 
                alt={liveModeData?.site_name || 'Admin Panel'}
              />
            </Link>
            <div className="side-menu-button" onClick={toggleSidebar}>
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
            <nav className="navbar navbar-expand-md btco-hover-menu">
        <div className="collapse navbar-collapse">
          <ul className="list-unstyled navbar-nav">
            {(!isAdminRole || mainMenuItems.some(item => hasPermission(adminUser, item.permission))) && (
              <>
                {mainMenuItems.map((item, index) => (
                  (!isAdminRole || hasPermission(adminUser, item.permission)) && (
                    <li key={index} className="nav-item">
                      <Link to={`${item.path}`}>
                        <b>{item.label}</b>
                      </Link>
                    </li>
                  )
                ))}
              </>
            )}
            {(!isAdminRole || (hasPermission(adminUser, 'casino') || hasPermission(adminUser, 'virtual') || hasPermission(adminUser, 'casino-market'))) && (
              <li className="nav-item dropdown newlacunch-menu">
                <a className="" href="#">
                  <span><b>casino-market</b> <i className="fa fa-caret-down"></i></span>
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  {(!isAdminRole || hasPermission(adminUser, 'casino')) && (
                    <li>
                      <Link to={`/casinos`} className="dropdown-item admin-dropdown-it-is">
                        <span><b>Casino</b></span>
                        <div className="lineanimation"></div>
                      </Link>
                    </li>
                  )}
                  {(!isAdminRole || hasPermission(adminUser, 'virtual')) && (
                    <li>
                      <Link to={`/casino/virtual`} className="dropdown-item admin-dropdown-it-is">
                        <span><b>Virtual</b></span>
                        <div className="lineanimation"></div>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            )}
            {(!isAdminRole || reportsMenuItems.some(item => hasPermission(adminUser, item.permission))) && (
              <li className="nav-item dropdown newlacunch-menu">
                <a className="" href="#">
                  <span><b>Reports</b> <i className="fa fa-caret-down"></i></span>
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  {reportsMenuItems.map((item, index) => (
                    (!isAdminRole || hasPermission(adminUser, item.permission)) && (
                      <li key={index}>
                        <Link to={`${item.path}`} className="dropdown-item admin-dropdown-it-is">
                          <span><b>{item.label}</b></span>
                          <div className="lineanimation"></div>
                        </Link>
                      </li>
                    )
                  ))}
                </ul>
              </li>
            )}
            {(!isAdminRole || settingsMenuItems.some(item => hasPermission(adminUser, item.permission))) && (
              <li className="nav-item dropdown newlacunch-menu">
                <a className="" href="#">
                  <span><b>Setting</b> <i className="fa fa-caret-down"></i></span>
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  {settingsMenuItems.map((item, index) => (
                    ((item.permission === 'block-market' || hasPermission(adminUser, item.permission))) && (
                      <li key={index}>
                        <a 
                          href="#"
                          className="dropdown-item admin-dropdown-it-is"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSettingsMenuClick(item);
                          }}
                        >
                          <span><b>{item.label}</b></span>
                          <div className="lineanimation"></div>
                        </a>
                      </li>
                    )
                  ))}
                </ul>
              </li>
            )}
          </ul>
              </div>
            </nav>
            <ul className="user-search list-unstyled">
              <li className="username" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                <span>{adminUser?.username || 'ADMIN'} <i className="fa fa-caret-down"></i></span>
                <ul style={{display: userDropdownOpen ? 'block' : 'none'}}>
                  <li>
                    <Link to={`/profile`}><b>Change Password</b></Link>
                  </li>
                  <li>
                    <span onClick={() => logout()}><b>Logout</b></span>
                  </li>
                </ul>
              </li>
              <li className="search">
                <input
                  id="tags2"
                  type="text"
                  name="list"
                  placeholder="All Client"
                  className="ui-autocomplete-input"
                  autoComplete="off"
                />
                <a id="clientList2" data-value="" href="#" onClick={(e) => e.preventDefault()}>
                  <i className="fas fa-search-plus"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="main">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className={`sidebar sidebar-main ${sidebarOpen ? 'fade-in' : ''}`} style={{display: sidebarOpen ? 'block' : 'none'}}>
              <nav>
                <h2>
                  <span>Sports</span>
                  <i className="fa fa-times float-right" onClick={toggleSidebar}></i>
                </h2>
                <div className="mtree-main">
                  <ul className="mtree transit bubba">
                    {Object.entries(navLinks).map(([sportName, sportData], index) => (
                      <li key={index} className={`mtree-node ${sportData.active === false ? 'mtree-closed' : 'mtree-open'}`}>
                        <a 
                          style={{cursor: 'pointer'}} 
                          onClick={() => activeLink(sportName)}
                        >
                          {sportName} 
                        </a>
                        <ul 
                          style={{
                            overflow: 'hidden', 
                            height: sportData.active === false ? '0px' : 'auto', 
                            display: sportData.active === false ? 'none' : 'block'
                          }} 
                          className="mtree-level-1"
                        >
                          {Object.entries(sportData.list || {}).map(([matchId, matchData], matchIndex) => (
                            <li key={matchIndex} className="mtree-node mtree-closed1">
                              <Link
                                to={`/${sportData.canonical_name}/${matchData.match_id}`}
                                style={{cursor: 'pointer'}}
                                onClick={() => activeLink(matchData.match_name)}
                              >
                                {matchData.match_name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            </div>

            {/* Main Content */}
            {/* <div className="col-md-12 main-container"> */}
            {/* </div> */}
          </div>
          {children}

        </div>
      </div>
      </div>
      </div>
      
      {/* Admin Password Verification Modal */}
      <AdminPasswordModal
        show={showPasswordModal}
        password={password}
        setPassword={setPassword}
        loading={passwordLoading}
        error={passwordError}
        onSubmit={handlePasswordSubmit}
        onClose={closeModal}
        onClearError={clearError}
      />
    </AdminRouteGuard>
  );
};

export default AdminLayout;
