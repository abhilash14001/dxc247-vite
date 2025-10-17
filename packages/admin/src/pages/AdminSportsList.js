import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from './adminApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { 
  faSort,
  faSortUp,
  faSortDown
} from '@fortawesome/free-solid-svg-icons';
import Pagination from '@dxc247/shared/components/common/Pagination';
import NoRecordsFound from '@dxc247/shared/components/common/NoRecordsFound';
import { useParams } from 'react-router-dom';
import Notify from '@dxc247/shared/utils/Notify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function AdminSportsList() {
  const { sportType } = useParams(); // Get sport type from URL parameter
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [updatingFavourite, setUpdatingFavourite] = useState(null); // Track which match is being updated
  const [showTeamWinnerModal, setShowTeamWinnerModal] = useState(false);
  const [showTossWinnerModal, setShowTossWinnerModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedWinner, setSelectedWinner] = useState('');
  const [teamNames, setTeamNames] = useState([]);
  const [loadingTeamNames, setLoadingTeamNames] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0
  });

  // Get sport display name and type
  const getSportInfo = (type) => {
    // Handle undefined or null type
    if (!type) {
      return { name: 'Sports', type: 'sport' };
    }
    
    const sportMap = {
      'cricket': { name: 'Cricket', type: 'sport' },
      'soccer': { name: 'Soccer', type: 'sport' },
      'tennis': { name: 'Tennis', type: 'sport' },
      'elections': { name: 'Elections', type: 'election' },
      'basketball': { name: 'Basketball', type: 'sport' },
      'football': { name: 'Football', type: 'sport' }
    };
    
    return sportMap[type] || { 
      name: type.charAt(0).toUpperCase() + type.slice(1), 
      type: 'sport' 
    };
  };

  const sportInfo = getSportInfo(sportType);

  // Fetch matches data from API
  const fetchMatches = useCallback(async (page = 1, search = '', sortField = 'id', sortDirection = 'asc') => {
    setLoading(true);
    try {
      // Build query parameters using React patterns
      const queryParams = {
        page: page,
        per_page: perPage,
        search: search,
        game_type: sportType || '',
        status: '' // You can add status filter if needed
      };

      // Make API call with query parameters
      const response = await adminApi(`${ADMIN_BASE_PATH}/games-list`, 'POST', queryParams);
      
      if (response.success) {
        // Transform API data to match component expectations
        const transformedData = response.data.map(game => ({
          id: game.id,
          match_name: game.match_name,
          match_date: game.created_at ? new Date(game.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'N/A',
          status: game.match_status ? 'Active' : 'InActive',
          favourite: game.is_favourite ? true : false,
          inplay: game.isPlay ? 'Yes' : 'No',
          game_type: game.game_type,
          game_id: game.game_id,
          isResultDeclear: game.isResultDeclear || 0,
          isResultDeclearToss: game.isResultDeclearToss || 0
        }));

        setMatches(transformedData);
        setPagination({
          current_page: response.pagination.current_page,
          per_page: response.pagination.per_page,
          total: response.pagination.total,
          last_page: response.pagination.last_page,
          from: response.pagination.from,
          to: response.pagination.to
        });
      } else {
        
        setMatches([]);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [perPage, sportType]);


  // Combined effect to handle all data loading (initial load, search, pagination, sorting)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Reset to first page when searching or sorting changes
      if (searchTerm || sortField !== 'id' || sortDirection !== 'asc') {
        setCurrentPage(1);
        fetchMatches(1, searchTerm, sortField, sortDirection);
      } else {
        // For page changes, use current page
        fetchMatches(currentPage, searchTerm, sortField, sortDirection);
      }
    }, searchTerm ? 1000 : 0); // 500ms delay for search, no delay for other changes

    return () => clearTimeout(timeoutId);
  }, [fetchMatches, searchTerm, sortField, sortDirection, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    
    setCurrentPage(page);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <FontAwesomeIcon icon={faSort} className="text-muted" />;
    }
    return sortDirection === 'asc' ? 
      <FontAwesomeIcon icon={faSortUp} /> : 
      <FontAwesomeIcon icon={faSortDown} />;
  };

  const getStatusBadge = (status) => {
    return status === 'Active' ? 
      <span className="badge badge-success" data-toggle="tooltip" title="Active">Active</span> :
      <span className="badge badge-danger" data-toggle="tooltip" title="InActive">InActive</span>;
  };

  const getInPlayBadge = (inplay) => {
    return inplay === 'Yes' ? 
      <span className="badge badge-success" data-toggle="tooltip" title="Yes">Yes</span> :
      <span className="badge badge-danger" data-toggle="tooltip" title="No">No</span>;
  };

  const handleFavouriteChange = async (matchId, isFavourite) => {
    // Prevent multiple clicks while updating
    if (updatingFavourite === matchId) return;

    try {
      // Set loading state
      setUpdatingFavourite(matchId);

      // Call API to update favourite status
      const response = await adminApi(`${ADMIN_BASE_PATH}/update-match-favourite`, 'POST', {
        sport_id: matchId,
        is_favourite: isFavourite ? 1 : 0
      });

      if (response.success) {
        // Update local state
        setMatches(matches.map(match => 
          match.id === matchId ? { ...match, favourite: isFavourite } : match
        ));
        
        // Show success notification
        Notify(
          response.message || 'Favourite status updated successfully', 
          null, 
          null, 
          'success'
        );
      } else {
        // Show error notification
        Notify(
          response.message || 'Failed to update favourite status', 
          null, 
          null, 
          'danger'
        );
      }
    } catch (error) {
      
      Notify(
        'Failed to update favourite status. Please try again.', 
        null, 
        null, 
        'danger'
      );
    } finally {
      // Clear loading state
      setUpdatingFavourite(null);
    }
  };

  const getResultApiEndpoint = (sportType) => {
    const sportTypeLower = sportType?.toLowerCase();
    switch (sportTypeLower) {
      case 'cricket':
        return `${ADMIN_BASE_PATH}/cricket-result`;
      case 'soccer':
      case 'football':
        return `${ADMIN_BASE_PATH}/soccer-result`;
      case 'tennis':
        return `${ADMIN_BASE_PATH}/tennis-result`;
      case 'elections':
        return `${ADMIN_BASE_PATH}/election-result`;
      default:
        return `${ADMIN_BASE_PATH}/cricket-result`; // Default fallback
    }
  };

  const getTossApiEndpoint = (sportType) => {
    const sportTypeLower = sportType?.toLowerCase();
    switch (sportTypeLower) {
      case 'cricket':
        return `${ADMIN_BASE_PATH}/cricket-toss-result`;
      case 'soccer':
      case 'football':
        return `${ADMIN_BASE_PATH}/soccer-toss-result`;
      case 'tennis':
        return `${ADMIN_BASE_PATH}/tennis-toss-result`;
      default:
        return `${ADMIN_BASE_PATH}/cricket-toss-result`; // Default fallback
    }
  };

  const getTossRollbackApiEndpoint = (sportType) => {
    const sportTypeLower = sportType?.toLowerCase();
    switch (sportTypeLower) {
      case 'cricket':
        return `${ADMIN_BASE_PATH}/cricket-toss-rollback`;
      case 'soccer':
      case 'football':
        return `${ADMIN_BASE_PATH}/soccer-toss-rollback`;
      case 'tennis':
        return `${ADMIN_BASE_PATH}/tennis-toss-rollback`;
      default:
        return `${ADMIN_BASE_PATH}/cricket-toss-rollback`; // Default fallback
    }
  };

  const fetchTeamNames = async (sportId) => {
    setLoadingTeamNames(true);
    try {
      const response = await adminApi(`${ADMIN_BASE_PATH}/get-team-names`, 'POST', {
        sport_id: sportId
      });

      if (response.success) {
        setTeamNames(response.data.teams || []);
      } else {
        Notify(
          response.message || 'Failed to load team names', 
          null, 
          null, 
          'danger'
        );
        setTeamNames([]);
      }
    } catch (error) {
      console.error('Error fetching team names:', error);
      Notify(
        'Failed to load team names. Please try again.', 
        null, 
        null, 
        'danger'
      );
      setTeamNames([]);
    } finally {
      setLoadingTeamNames(false);
    }
  };

  const showSportWinnerModel = (matchId) => {
    setSelectedMatch({ id: matchId });
    setSelectedWinner('');
    setShowTeamWinnerModal(true);
    fetchTeamNames(matchId);
  };

  const showTossWinnerModel = (matchId) => {
    setSelectedMatch({ id: matchId });
    setSelectedWinner('');
    setShowTossWinnerModal(true);
    fetchTeamNames(matchId);
  };

  const handleCloseTeamWinnerModal = () => {
    setShowTeamWinnerModal(false);
    setSelectedMatch(null);
    setSelectedWinner('');
    setTeamNames([]);
  };

  const handleCloseTossWinnerModal = () => {
    setShowTossWinnerModal(false);
    setSelectedMatch(null);
    setSelectedWinner('');
    setTeamNames([]);
  };

  const handleWinnerSubmit = async () => {
    if (!selectedWinner) {
      Notify('Please select a winner team', null, null, 'warning');
      return;
    }

    try {
      // Set loading state
      setUpdatingFavourite(selectedMatch.id);

      // Call API to set the winner based on sport type
      const apiEndpoint = getResultApiEndpoint(sportType);
      const response = await adminApi(apiEndpoint, 'POST', {
        sport_id: selectedMatch.id,
        result: selectedWinner
      });

      if (response.success) {
        // Remove match from the list after successful result declaration
        setMatches(matches.filter(match => match.id !== selectedMatch.id));
        
        // Update pagination to reflect the removed match
        setPagination(prevPagination => ({
          ...prevPagination,
          total: prevPagination.total - 1,
          to: prevPagination.to - 1
        }));
        
        // Show success notification
        Notify(
          response.message || 'Result declared successfully', 
          null, 
          null, 
          'success'
        );
        handleCloseTeamWinnerModal();
      } else {
        // Show error notification
        Notify(
          response.message || 'Failed to declare result', 
          null, 
          null, 
          'danger'
        );
      }
    } catch (error) {
      Notify(
        'Failed to declare result. Please try again.', 
        null, 
        null, 
        'danger'
      );
    } finally {
      // Clear loading state
      setUpdatingFavourite(null);
    }
  };

  const handleTossWinnerSubmit = async () => {
    if (!selectedWinner) {
      Notify('Please select a toss winner team', null, null, 'warning');
      return;
    }

    try {
      // Set loading state
      setUpdatingFavourite(selectedMatch.id);

      // Call API to set the toss winner
      const apiEndpoint = getTossApiEndpoint(sportType);
      const response = await adminApi(apiEndpoint, 'POST', {
        sport_id: selectedMatch.id,
        result: selectedWinner
      });

      if (response.success) {
        // Update local state to mark toss result as declared
        setMatches(matches.map(match => 
          match.id === selectedMatch.id ? { 
            ...match, 
            isResultDeclearToss: 1 
          } : match
        ));
        
        // Show success notification
        Notify(
          response.message || 'Toss result declared successfully', 
          null, 
          null, 
          'success'
        );
        handleCloseTossWinnerModal();
      } else {
        // Show error notification
        Notify(
          response.message || 'Failed to declare toss result', 
          null, 
          null, 
          'danger'
        );
      }
    } catch (error) {
      Notify(
        'Failed to declare toss result. Please try again.', 
        null, 
        null, 
        'danger'
      );
    } finally {
      // Clear loading state
      setUpdatingFavourite(null);
    }
  };

  const handleTossResultRollback = async (matchId) => {
    try {
      // Set loading state
      setUpdatingFavourite(matchId);

      // Call API to rollback toss result
      const apiEndpoint = getTossRollbackApiEndpoint(sportType);
      const response = await adminApi(apiEndpoint, 'POST', {
        sport_id: matchId
      });

      if (response.success) {
        // Remove match from the list after successful toss rollback
        setMatches(matches.filter(match => match.id !== matchId));
        
        // Update pagination to reflect the removed match
        setPagination(prevPagination => ({
          ...prevPagination,
          total: prevPagination.total - 1,
          to: prevPagination.to - 1
        }));
        
        // Show success notification
        Notify(
          response.message || 'Toss result rollback successful', 
          null, 
          null, 
          'success'
        );
      } else {
        // Show error notification
        Notify(
          response.message || 'Failed to rollback toss result', 
          null, 
          null, 
          'danger'
        );
      }
    } catch (error) {
      Notify(
        'Failed to rollback toss result. Please try again.', 
        null, 
        null, 
        'danger'
      );
    } finally {
      // Clear loading state
      setUpdatingFavourite(null);
    }
  };

  const sportChangeStatus = async (matchId) => {
    try {
      // Find the current match to get its current status
      const currentMatch = matches.find(match => match.id === matchId);
      if (!currentMatch) return;

      const newStatus = currentMatch.status === 'Active' ? 0 : 1; // Toggle status
      
      // Set loading state
      setUpdatingFavourite(matchId);

      // Call API to update match status
      const response = await adminApi(`${ADMIN_BASE_PATH}/update-match-status`, 'POST', {
        sport_id: matchId,
        match_status: newStatus
      });

      if (response.success) {
        // Update local state
        setMatches(matches.map(match => 
          match.id === matchId ? { 
            ...match, 
            status: newStatus ? 'Active' : 'InActive' 
          } : match
        ));
        
        // Show success notification
        Notify(
          response.message || 'Match status updated successfully', 
          null, 
          null, 
          'success'
        );
      } else {
        // Show error notification
        Notify(
          response.message || 'Failed to update match status', 
          null, 
          null, 
          'danger'
        );
      }
    } catch (error) {
      Notify(
        'Failed to update match status. Please try again.', 
        null, 
        null, 
        'danger'
      );
    } finally {
      // Clear loading state
      setUpdatingFavourite(null);
    }
  };

  const sportChangePlayStatus = async (matchId) => {
    try {
      // Find the current match to get its current play status
      const currentMatch = matches.find(match => match.id === matchId);
      if (!currentMatch) return;

      const newPlayStatus = currentMatch.inplay === 'Yes' ? 0 : 1; // Toggle play status
      
      // Set loading state
      setUpdatingFavourite(matchId);

      // Call API to update play status
      const response = await adminApi(`${ADMIN_BASE_PATH}/update-match-status`, 'POST', {
        sport_id: matchId,
        isPlay: newPlayStatus
      });

      if (response.success) {
        // Update local state
        setMatches(matches.map(match => 
          match.id === matchId ? { 
            ...match, 
            inplay: newPlayStatus ? 'Yes' : 'No' 
          } : match
        ));
        
        // Show success notification
        Notify(
          response.message || 'Play status updated successfully', 
          null, 
          null, 
          'success'
        );
      } else {
        // Show error notification
        Notify(
          response.message || 'Failed to update play status', 
          null, 
          null, 
          'danger'
        );
      }
    } catch (error) {
      Notify(
        'Failed to update play status. Please try again.', 
        null, 
        null, 
        'danger'
      );
    } finally {
      // Clear loading state
      setUpdatingFavourite(null);
    }
  };

  const getActionButtons = (match) => {
    const isElection = sportInfo.type === 'election';
    const isCricket = sportType.toLowerCase() === 'cricket';
    const isUpdating = updatingFavourite === match.id;
    
    return (
      <div className="action-buttons pull-right">
        {/* Team Winner / Result Declared Button */}
        {match.isResultDeclear === 0 ? (
          <a 
            href="javascript:void(0);" 
            onClick={() => showSportWinnerModel(match.id)} 
            className="btn btn-success btn-sm me-1"
            style={{ opacity: isUpdating ? 0.6 : 1, pointerEvents: isUpdating ? 'none' : 'auto' }}
          >
            {isElection ? 'Set Winner' : 'Team Winner'}
          </a>
        ) : (
          <a 
            href="javascript:void(0);" 
            className="btn btn-success btn-sm me-1"
            style={{ opacity: 0.6, pointerEvents: 'none' }}
          >
            Result Declared
          </a>
        )}

        {/* Manage Fancy Button for Elections */}
        {isElection && (
          <a 
            href={`${ADMIN_BASE_PATH}/sports/electionFancyControl/${btoa(match.id.toString())}`}
            className="btn btn-success btn-sm me-1"
            style={{ opacity: isUpdating ? 0.6 : 1, pointerEvents: isUpdating ? 'none' : 'auto' }}
          >
            Manage Fancy
          </a>
        )}

        {/* Toss Result Button for Cricket */}
        {isCricket && match.game_id === 1 && (
          match.isResultDeclearToss === 0 ? (
            <a 
              href="javascript:void(0);" 
              onClick={() => showTossWinnerModel(match.id)} 
              className="btn btn-success btn-sm me-1"
              style={{ opacity: isUpdating ? 0.6 : 1, pointerEvents: isUpdating ? 'none' : 'auto' }}
            >
              Toss Result
            </a>
          ) : (
            <a 
              href="javascript:void(0);" 
              onClick={() => handleTossResultRollback(match.id)} 
              className="btn btn-success btn-sm me-1"
              style={{ opacity: isUpdating ? 0.6 : 1, pointerEvents: isUpdating ? 'none' : 'auto' }}
            >
              Toss Result Rollback
            </a>
          )
        )}

        {/* Change Status Button */}
        <a 
          href="javascript:void(0);" 
          onClick={() => sportChangeStatus(match.id)} 
          className="btn btn-success btn-sm me-1"
          style={{ opacity: isUpdating ? 0.6 : 1, pointerEvents: isUpdating ? 'none' : 'auto' }}
        >
          {isUpdating ? (
            <>
              <i className="fas fa-spinner fa-spin me-1"></i>
              Updating...
            </>
          ) : (
            'Change Status'
          )}
        </a>

        {/* Change Play Status Button */}
        <a 
          href="javascript:void(0);" 
          onClick={() => sportChangePlayStatus(match.id)} 
          className="btn btn-success btn-sm"
          style={{ opacity: isUpdating ? 0.6 : 1, pointerEvents: isUpdating ? 'none' : 'auto' }}
        >
          {isUpdating ? (
            <>
              <i className="fas fa-spinner fa-spin me-1"></i>
              Updating...
            </>
          ) : (
            'Change Play Status'
          )}
        </a>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
    </div>
      </div>
    </div>
    );
  }

  return (
    <>
      <style>
        {`
          .admin-sports-list thead tr th:last-child,
          .admin-sports-list tbody tr td:last-child{
              text-align: right;
          }
          .admin-sports-list thead tr th,
          .admin-sports-list tbody tr td{
              font-size: 18px;
          }
          .admin-sports-list .form-control:focus{
              border: 1px solid #e2e2e2;
          }
        `}
      </style>
      <div className="admin-sports-list">
        <div className="row">
      <div className="col-md-12 main-container">
          <div className="listing-grid">
            <div className="detail-row">
              <h2 className="d-inline-block">{sportInfo.name} List</h2>
            </div>
    </div>
            
            <div className="table-responsive data-table">
              <div className="card">
                <div className="card-body">
                  <input
                    type="text"
                    style={{ width: "20%", float: "right" }} 
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    autoFocus="true"
                    className="form-control"
                    placeholder={`Search ${sportInfo.name.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  
                  <div className="clearfix"></div>
    </div>

                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>SR. NO.</th>
                          <th>{sportInfo.type === 'election' ? 'Election Name' : 'Match Name'}</th>
                          <th 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('match_date')}
                          >
                            {sportInfo.type === 'election' ? 'Election Date' : 'Match Date'} {getSortIcon('match_date')}
                          </th>
                          <th>Status</th>
                          <th>Favourite</th>
                          <th>InPlay</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matches.length > 0 ? (
                          matches.map((match, index) => (
                            <tr key={match.id}>
                              <td>{pagination.from + index}</td>
                              <td>
                                <a href={`${import.meta.env.VITE_MAIN_URL}/sports/${sportType || 'cricket'}/${encodeURIComponent(match.id.toString())}`}>
                                  {match.match_name}
                                </a>
                              </td>
                              <td>{match.match_date}</td>
                              <td>{getStatusBadge(match.status)}</td>
                            <td>
                              <input 
                                type="checkbox" 
                                checked={match.favourite}
                                disabled={updatingFavourite === match.id}
                                onChange={(e) => handleFavouriteChange(match.id, e.target.checked)}
                              />
                              {updatingFavourite === match.id && (
                                <span className="ml-2 text-muted">
                                  <i className="fas fa-spinner fa-spin"></i>
                                </span>
                              )}
                            </td>
                              <td>{getInPlayBadge(match.inplay)}</td>
                              <td>
                                {getActionButtons(match)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <NoRecordsFound colSpan={7} />
                        )}
                      </tbody>
                    </table>
                  </div>
    </div>

                  {!loading && matches.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <div className="dataTables_info">
                        Showing {pagination.from} to {pagination.to} of {pagination.total} entries
                      </div>
    </div>
                      <Pagination
                        currentPage={pagination.current_page}
                        totalPages={pagination.last_page}
                        onPageChange={handlePageChange}
                        maxVisiblePages={5}
                        showPreviousNext={true}
                      />
                    </div>
    </div>
                  )}
                </div>
    </div>
              </div>
    </div>
            </div>
    </div>
          </div>
    </div>
        </div>
    </div>
      </div>
    </div>

      {/* Team Winner Modal */}
      <Modal show={showTeamWinnerModal} onHide={handleCloseTeamWinnerModal}>
        <Modal.Header  style={{ backgroundColor: 'var(--theme1-bg)', color: 'white' }}>
          <Modal.Title>Winner Declare</Modal.Title>
          <button
            className="close" data-dismiss="modal" aria-label="Close"
            onClick={handleCloseTeamWinnerModal}
          >
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="winnerSelect">Select Winner Team Name</label>
            <select 
              className="form-control" 
              id="winnerSelect"
              value={selectedWinner}
              onChange={(e) => setSelectedWinner(e.target.value)}
              disabled={loadingTeamNames}
            >
              <option value="">
                {loadingTeamNames ? 'Loading teams...' : 'Select Winner Team'}
              </option>
              {teamNames.map((team, index) => (
                <option key={index} value={team}>
                  {team}
                </option>
              ))}
            </select>
            {loadingTeamNames && (
              <div className="text-center mt-2">
                <i className="fas fa-spinner fa-spin"></i> Loading team names...
              </div>
    </div>
            )}
          </div>
    </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTeamWinnerModal}>
            <i className="fas fa-arrow-left me-1"></i>
            Back
          </Button>
          <Button 
            onClick={handleWinnerSubmit}
            disabled={loadingTeamNames || updatingFavourite === selectedMatch?.id}
            style={{ backgroundColor: 'var(--theme1-bg)', borderColor: 'var(--theme1-bg)', color: 'white' }}
          >
            {updatingFavourite === selectedMatch?.id ? (
              <>
                <i className="fas fa-spinner fa-spin me-1"></i>
                Submitting...
              </>
            ) : (
              <>
                Submit
                <i className="fas fa-arrow-right ms-1"></i>
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toss Winner Modal */}
      <Modal show={showTossWinnerModal} onHide={handleCloseTossWinnerModal}>
        <Modal.Header style={{ backgroundColor: 'var(--theme1-bg)', color: 'white' }}>
          <Modal.Title>Toss Winner Declare</Modal.Title>
          <button
            className="close" data-dismiss="modal" aria-label="Close"
            onClick={handleCloseTossWinnerModal}
          >
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="tossWinnerSelect">Select Toss Winner Team Name</label>
            <select 
              className="form-control" 
              id="tossWinnerSelect"
              value={selectedWinner}
              onChange={(e) => setSelectedWinner(e.target.value)}
              disabled={loadingTeamNames}
            >
              <option value="">
                {loadingTeamNames ? 'Loading teams...' : 'Select Winner Team'}
              </option>
              {teamNames.map((team, index) => (
                <option key={index} value={team}>
                  {team}
                </option>
              ))}
            </select>
            {loadingTeamNames && (
              <div className="text-center mt-2">
                <i className="fas fa-spinner fa-spin"></i> Loading team names...
              </div>
    </div>
            )}
          </div>
    </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTossWinnerModal}>
            <i className="fas fa-arrow-left me-1"></i>
            Back
          </Button>
          <Button 
            onClick={handleTossWinnerSubmit}
            disabled={loadingTeamNames || updatingFavourite === selectedMatch?.id}
            style={{ backgroundColor: 'var(--theme1-bg)', borderColor: 'var(--theme1-bg)', color: 'white' }}
          >
            {updatingFavourite === selectedMatch?.id ? (
              <>
                <i className="fas fa-spinner fa-spin me-1"></i>
                Submitting...
              </>
            ) : (
              <>
                Submit
                <i className="fas fa-arrow-right ms-1"></i>
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AdminSportsList;
