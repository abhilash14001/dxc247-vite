import React, { useState, useEffect, useRef } from 'react';
import { adminApi } from './adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const AdminClientTrack = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const loadClients = async (page = 1, search = '', append = false) => {
    append ? setLoadingMore(true) : setLoading(true);

    try {
      const response = await adminApi(
        `${ADMIN_BASE_PATH}/client-track?page=${page}&per_page=15&search=${encodeURIComponent(search)}`,
        'GET'
      );

      if (response.success) {
        const newClients = response.data || [];
        append ? setClients(prev => [...prev, ...newClients]) : setClients(newClients);
        setHasMore(response.pagination?.current_page < response.pagination?.last_page);
        setCurrentPage(page);
      } else {
        if (!append) setClients([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      if (!append) setClients([]);
      setHasMore(false);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  const searchData = async () => {
    if (!selectedClientId) {
      toast.error('Please select a client');
      return;
    }

    setLoading(true);
    try {
      const response = await adminApi(`${ADMIN_BASE_PATH}/client-track-data`, 'POST', {
        userID: selectedClientId,
      });

      if (response.success) {
        setSearchResults(response.data);
        setBreadcrumb(response.data.hierarchy_path ? response.data.hierarchy_path.split(' > ') : []);
        toast.success('Client data loaded successfully');
      } else {
        toast.error(response.message || 'Failed to load client data');
        setSearchResults(null);
        setBreadcrumb([]);
      }
    } catch (error) {
      console.error('Error searching client data:', error);
      toast.error('Failed to load client data. Please try again.');
      setSearchResults(null);
      setBreadcrumb([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadClients(1, searchTerm, false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const loadMoreClients = () => {
    if (hasMore && !loadingMore && !loading) {
      loadClients(currentPage + 1, searchTerm, true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setHasMore(true);
    setShowDropdown(true);
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleClientSelect = (client) => {
    setSelectedClientId(client.id);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 100) loadMoreClients();
  };

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="add-account">
          <h2 className="m-b-20">Client Track</h2>

          <div className="d-flex" style={{ gap: '10px' }}>
            {/* Dropdown */}
            <div className="col-md-2" style={{ width: '20%', position: 'relative' }}>
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
                  type="button"
                  onClick={toggleDropdown}
                  disabled={loading}
                >
                  <span>
                    {selectedClientId
                      ? clients.find(c => c.id === selectedClientId)?.username || 'Select Client'
                      : 'Select Client'}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} />
                </button>

                {showDropdown && (
                  <div
                    className="dropdown-menu show w-100"
                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                    onScroll={handleScroll}
                  >
                    <div className="px-3 py-2 border-bottom">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {loading && (
                      <div className="text-center py-2">
                        <FontAwesomeIcon icon={faSpinner} spin />
                        <small className="ms-2">Loading...</small>
                      </div>
                    )}

                    {clients.map((client) => (
                      <button
                        key={client.id}
                        className={`dropdown-item d-flex justify-content-between align-items-center ${
                          selectedClientId === client.id ? 'active' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClientSelect(client);
                        }}
                      >
                        <div>
                          <strong>{client.username}</strong>
                          <br />
                          <small className="text-muted">{client.name}</small>
                        </div>
                        {selectedClientId === client.id && (
                          <FontAwesomeIcon icon={faSearch} className="text-primary" />
                        )}
                      </button>
                    ))}

                    {loadingMore && (
                      <div className="text-center py-2 border-top">
                        <FontAwesomeIcon icon={faSpinner} spin />
                        <small className="ms-2">Loading more...</small>
                      </div>
                    )}

                    {!hasMore && clients.length > 0 && (
                      <div className="text-center py-2 text-muted border-top">
                        <small>No more clients</small>
                      </div>
                    )}

                    {!loading && clients.length === 0 && searchTerm && (
                      <div className="text-center py-3 text-muted">
                        <small>No clients found</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="col-md-2" style={{ width: '20%' }}>
              <button
                className="btn btn-success w-100"
                onClick={searchData}
                id="search"
                disabled={loading || !selectedClientId}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-1" />
                    Searching...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSearch} className="me-1" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="clearfix" />

          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <div className="details">
              <div style={{ padding: '10px', marginTop: '10px' }}>
                <h4>
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={index}>
                      <span style={{ padding: '5px' }}>{item}</span>
                      {index < breadcrumb.length - 1 && <span> &gt; </span>}
                    </React.Fragment>
                  ))}
                </h4>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClientTrack;
