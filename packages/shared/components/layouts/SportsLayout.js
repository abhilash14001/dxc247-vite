import React, { useContext, useEffect, useState, useCallback } from "react";
import axiosFetch, { isAdminRoute, ADMIN_BASE_PATH, exposureCheck, store } from "@dxc247/shared/utils/Constants";
import { getBetListData } from "@dxc247/shared/utils/betUtils";
import { adminApi } from "@dxc247/shared/utils/adminApi";
import Pagination from "@dxc247/shared/components/common/Pagination";
import Notify from "@dxc247/shared/utils/Notify";
import { useConfirmModal } from "@dxc247/shared/components/ui/useConfirmModal";
import ConfirmModal from "@dxc247/shared/components/ui/ConfirmModal";
import AdminSportsControlPanel from "@dxc247/shared/components/admin/AdminSportsControlPanel";

import { useParams } from "react-router-dom";
import { CommonContext } from "@dxc247/shared/contexts/CommonContext";
import Loader from "@dxc247/shared/components/Loader";
import { SportsContext } from "@dxc247/shared/contexts/SportsContext";


const SportsLayout = ({
  currentOddValue = [],
  setPlacingBets = null,
  callTeamDatas = null,
  placingBets = [],

  gameId = null,
  setOddsTeamData = null,
  children,
  setSportList,
  sportList,
  teamNameCurrentBets,

  individualBetPlaceFetch,
  data,
  betType,
  backOrLay,
  teamname,
  odds,
  teamNames,
  setOdds,
  setPopupDisplay,
  popupDisplay,
  maxValue = 1,
  minValue,
  refreshSpecificBetType,
}) => {
  const { match_id } = useParams();

  const [myBetModel, setMyBetModel] = useState({});
  const [activeTab, setActiveTab] = useState('odds');
  const [openDropdowns, setOpenDropdowns] = useState({});
  
  // Username dropdown state
  const [userOptions, setUserOptions] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('ALL');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Bet data state - following admin components pattern
  const [betData, setBetData] = useState([]);
  const [loadingBets, setLoadingBets] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Pagination states - matching admin components
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(20);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    user_id: '',
    amount_start: '',
    amount_end: '',
    ip_address: '',
    bet_side: ''
  });

  // Checkbox selection states
  const [selectedBets, setSelectedBets] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Confirmation modal hook
  const { modal: confirmModal, showConfirm, hideModal } = useConfirmModal();

  const { formatDateTime } = useContext(CommonContext);
  const { showLoader, triggerSocket, setTriggerSocket } =
    useContext(SportsContext);
  const exposure = exposureCheck();

  useEffect(() => {
    const getData = async () => {
      await axiosFetch(`sport_data/${match_id}`, "get").then((res) =>
        setSportList(res.data)
      );
    };

    getData();
    

    // eslint-disable-next-line
  }, [match_id]);

  // Use the common getBetListData function
  const localGetBetListData = async () => {
    await getBetListData(match_id, setMyBetModel);
  };

  useEffect(() => {
    localGetBetListData();

    // eslint-disable-next-line
  }, [exposure]);

  useEffect(() => {
    setTriggerSocket(true);
  }, []);



  // Load bet data - following admin components pattern
  const loadBetData = useCallback(async () => {
    try {
      if (!isLoaded) {
        setLoadingBets(true);
      }
      
      const params = {
        sport_id: match_id,
        page: currentPage,
        per_page: perPage,
        search: searchTerm || '',
        user_id: selectedUserId || filters.user_id,
        amount_start: filters.amount_start,
        amount_end: filters.amount_end,
        ip_address: filters.ip_address,
        bet_side: filters.bet_side
      };

      const response = await adminApi(`${ADMIN_BASE_PATH}/bets/manage`, "POST", params);
      
      if (response.success) {
        setBetData(response.data.bets || []);
        setTotalPages(response.data.pagination?.last_page || 1);
        setTotalRecords(response.data.pagination?.total || 0);
        setIsLoaded(true);
        // Reset selection when data changes
        setSelectedBets([]);
        setSelectAll(false);
      } else {
        console.error("Failed to load bet data:", response.message);
        setBetData([]);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error loading bet data:", error);
      setBetData([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setIsLoaded(true);
      setLoadingBets(false);
    }
  }, [match_id, currentPage, perPage, searchTerm, selectedUserId, filters, isLoaded]);

  // Handle individual bet delete/restore action
  const handleIndividualBetAction = async (betId, isDeleted) => {
    const action = isDeleted ? 'restore' : 'delete';
    const actionText = isDeleted ? 'restore' : 'delete';
    
    // Check if admin has bet delete access (only for delete action, not restore)
    if (!isDeleted && isAdminRoute()) {
      const adminUser = store.getState().admin?.user;
      const isSuperAdmin = adminUser?.role === 1;
      const isBetDeleteAccess = adminUser?.isBetDeleteAccess === 1 || adminUser?.isBetDeleteAccess === true;
      
      if (!isBetDeleteAccess && !isSuperAdmin) {
        Notify("You do not have permission to delete bets.", null, null, 'danger');
        return;
      }
    }
    
    const confirmed = await showConfirm({
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Bet`,
      message: `Are you sure you want to ${actionText} this bet?`,
      confirmText: actionText.charAt(0).toUpperCase() + actionText.slice(1),
      cancelText: "Cancel",
      type: isDeleted ? "warning" : "danger",
      onConfirm: async () => {
        try {
          setLoadingBets(true);
          
          // Call the API to delete/restore single bet
          const response = await adminApi(`${ADMIN_BASE_PATH}/delete-multiple-bets`, 'POST', {
            bet_ids: JSON.stringify([betId]),
            is_deleted: isDeleted ? 0 : 1 // 0 for restore, 1 for delete
          });

          if (response.success) {
            Notify(response.message || `Bet ${actionText}d successfully`, null, null, 'success');
            
            // Reload bet data to reflect changes
            setIsLoaded(false);
            loadBetData();
          } else {
            Notify(response.message || `Failed to ${actionText} bet`, null, null, 'danger');
          }
        } catch (error) {
          console.error(`Error ${actionText}ing bet:`, error);
          Notify(`Failed to ${actionText} bet. Please try again.`, null, null, 'danger');
        } finally {
          setLoadingBets(false);
        }
      }
    });
  };


  // Calculate matched bet count
  const matchedBetCount = Array.isArray(myBetModel) ? myBetModel.length : 0;

  // Toggle dropdown function - only one dropdown open at a time
  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns(prev => {
      // If clicking the same dropdown, toggle it
      if (prev[dropdownName]) {
        return { [dropdownName]: false };
      }
      // If clicking a different dropdown, close all others and open this one
      return { [dropdownName]: true };
    });
  };

  // Filter users based on search term
  const filterUsers = useCallback((searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredUsers(userOptions);
    } else {
      const filtered = userOptions.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [userOptions]);

  // Handle user search input change
  const handleUserSearchChange = (e) => {
    const searchTerm = e.target.value;
    setUserSearchTerm(searchTerm);
    filterUsers(searchTerm);
    setShowUserDropdown(true);
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUserId(user.id);
    setUserSearchTerm(user.username);
    setShowUserDropdown(false);
  };

  // Handle user input focus
  const handleUserInputFocus = () => {
    setShowUserDropdown(true);
    if (!userSearchTerm.trim()) {
      setFilteredUsers(userOptions);
    } else {
      filterUsers(userSearchTerm);
    }
  };

  // Handle user input blur
  const handleUserInputBlur = () => {
    setTimeout(() => {
      setShowUserDropdown(false);
    }, 200);
  };

  // Clear user search
  const clearUserSearch = () => {
    setUserSearchTerm('');
    setSelectedUserId('');
    setFilteredUsers(userOptions);
  };

  // Handle search input - following admin components pattern
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter changes - following admin components pattern
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle pagination - following admin components pattern
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Data loading is now handled by useEffect
  };

  // Handle per page change - following admin components pattern
  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle "All" button - load all data
  const handleLoadAll = () => {
    setSearchTerm('');
    setFilters({
      user_id: '',
      amount_start: '',
      amount_end: '',
      ip_address: '',
      bet_side: ''
    });
    setSelectedUserId('');
    setUserSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="detail-page-container">
      
      {/* Admin Control Panel - Only show for admin users */}
      {isAdminRoute() && (
        <AdminSportsControlPanel 
          sportId={sportList?.id} 
          sportName={sportList?.mname}
          matchId={match_id}
        />
      )}
      
      <div className="game-header">
        <span>{sportList?.match_name}</span>
        {sportList.match_date && (
          <span className="float-right">
            {formatDateTime(new Date(sportList?.match_date))}
          </span>
        )}
      </div>
      <ul className="nav nav-tabs d-xl-none menu-tabs">
        <li className="nav-item">
          <a 
            className={`nav-link ${activeTab === 'odds' ? 'active' : ''}`} 
            onClick={() => setActiveTab('odds')}
            style={{ cursor: 'pointer' }}
          >
            Odds
          </a>
        </li>
        <li className="nav-item">
          <a 
            className={`nav-link ${activeTab === 'bets' ? 'active' : ''}`} 
            onClick={() => setActiveTab('bets')}
            style={{ cursor: 'pointer' }}
          >
            Matched Bet ({matchedBetCount})
          </a>
        </li>
        {sportList.isTv === 1 && sportList.isPlay === 1 && (
        <li className="nav-item">
          <a 
            className={`nav-link ${activeTab === 'tv' ? 'active' : ''}`} 
            onClick={() => setActiveTab('tv')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-tv"></i>
          </a>
        </li>
        )}
      </ul>
      
      {showLoader === true && <Loader />}

      {/* Odds Tab Content */}
      {activeTab === 'odds' && children}

      {/* Matched Bet Tab Content */}
      {activeTab === 'bets' && (
        <div className="table-responsive w-100">
          <table className="table">
            <thead>
              <tr>
                <th>Matched Bet</th>
                <th className="text-end">Odds</th>
                <th className="text-end">Stake</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(myBetModel) && myBetModel.length > 0 && (
               myBetModel.length > 0 && (
                myBetModel.map((data, index) => {
                    const className = data.bet_side === "LAY" && data.type !== 'ODDEVEN' ? "lay" : "back";
                    return (
                        <tr key={index} className={className}>

                            {data.type === 'FANCY_SESSION' || data.type === 'OVER_BY_OVER' ? (

                                <td>{data.team_name}  / {data.bet_oddsk}</td>
                            )

                                : <td>{data.team_name} </td>

                            }
                            <td className="text-end">{data.bet_odds}</td>


                            <td className="text-end">{data.bet_amount}</td>
                        </tr>
                    );
                })
            )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TV Tab Content */}
      {activeTab === 'tv' && (
        <div className="live-tv d-xl-none">
          {sportList.match_id && sportList.isTv === 1 && sportList.isPlay === 1 && (
            <iframe 
              allow="autoplay" 
              src={`${import.meta.env.VITE_LIVE_STREAM_URL}/${sportList.match_id}`} 
              style={{ width: '100%', border: '0px', height: '300px' }}
              title="Live TV Stream"
            />
          )}
        </div>
      )}


      {/* Confirm Modal */}
      <ConfirmModal
        show={confirmModal.show}
        onHide={hideModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        type={confirmModal.type}
      />

    </div>
  );
};
export default SportsLayout;
