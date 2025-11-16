import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';



function AdminDashboard() {
  const [marketAnalysisData, setMarketAnalysisData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
    from: null,
    to: null
  });
    const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState([]);
  
  const { isAuthenticated } = useSelector(state => state.admin);
  const navigate = useNavigate();

  // Authentication check - AdminRouteGuard handles this, so we don't need to redirect here
  // This check is redundant and can cause redirect loops
  // useEffect(() => {
  //   if(!isAuthenticated) {
  //     navigate('/login');
  //     return;
  //   }
  // }, [isAuthenticated, navigate]);

  // Debounced search effect
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      setAllData([]); // Clear existing data
      setHasMore(true); // Reset hasMore flag
      loadMarketAnalysisData();
    }, 500); // 500ms delay
    return () => clearTimeout(timeoutId);
  }, [searchTerm, isAuthenticated]);

  // Load data when page changes (but not on initial mount)
  useEffect(() => {
    if (!isAuthenticated) return;
    if (currentPage > 1) {
      loadMarketAnalysisData();
    }
  }, [currentPage, isAuthenticated]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      // Load more when scrolled to bottom (with 200px buffer)
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        if (hasMore && !loading) {
          setCurrentPage(prev => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, currentPage]);

  const loadMarketAnalysisData = async () => {
    try {
      setLoading(true);
      
      // Load market analysis data using GET request with query parameters
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 10, // Fixed at 10 entries per page
        search: searchTerm
      });
      
      // Add team name parameters if they exist in the data
      if (marketAnalysisData.length > 0) {
        const firstRow = marketAnalysisData[0];
        if (firstRow.teamname_a) {
          params.append('teamname_a', firstRow.teamname_a);
        }
        if (firstRow.teamname_b) {
          params.append('teamname_b', firstRow.teamname_b);
        }
      }
      
      const marketResponse = await adminApi(`${ADMIN_BASE_PATH}/market-analysis?${params}`, 'GET');
      

      if (marketResponse) {
        const newData = marketResponse || [];

        
        
        if (currentPage === 1) {
          // First page - replace all data
          setAllData(newData);
        } else {
          // Subsequent pages - append to existing data
          setAllData(prev => [...prev, ...newData]);
        }
        setPagination(marketResponse.pagination || {
          current_page: 1,
          per_page: 10,
          total: 0,
          last_page: 1,
          from: null,
          to: null
        });
        const hasMoreData = currentPage < (marketResponse.pagination?.last_page || 1);
        setHasMore(hasMoreData);
      } else {
        console.error('API Error:', marketResponse.message);
        setAllData([]);
        setMarketAnalysisData([]);
        setPagination({
          current_page: 1,
          per_page: 10,
          total: 0,
          last_page: 1,
          from: null,
          to: null
        });
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading market analysis data:', error);
      
      // Clear data on error
      setAllData([]);
      setMarketAnalysisData([]);
      setPagination({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
        from: null,
        to: null
      });
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Card-based layout - no table structure needed

  // Use all accumulated data for infinite scroll
  const displayData = allData;

  // Card-based layout - search handled by API

  return (
      <div className="listing-grid">
      <div className="detail-row">
        <h2 className="d-inline-block">Market Analysis</h2>
      </div>

      <div>
        <div className="card">
          <div className="card-body">
            <div className="card-layout-wrapper">
              {/* Search Control */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <input 
                      type="search" 
                      className="form-control"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search matches..." 
                      disabled={loading}
                    />
                    {loading && <span className="input-group-text text-primary"><FontAwesomeIcon icon={faSpinner} className="fa-spin" /></span>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted d-flex align-items-center h-100">
                    <small>Scroll down to load more data (10 entries per page)</small>
                  </div>
                </div>
              </div>
              
              {/* Card-based layout similar to the reference design */}
              <div className="row">
                {displayData.map((item, index) => (
                  
                  <div key={item.id || index} className="col-md-6 col-lg-4 mb-4">
                    <div className="card shadow-sm" style={{ border: 'none' }}>
                      {/* Match Header */}
                      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center" style={{ padding: '12px 16px' }}>
                        <div>
                          <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: '600' }}>
                            {item.match_name}
                          </h6>
                        </div>
                        <div style={{ fontSize: '12px', opacity: '0.8' }}>
                          {new Date(item.match_date_time).toLocaleDateString('en-GB')} {new Date(item.match_date_time).toLocaleTimeString('en-GB', { hour12: false })}
                        </div>
                      </div>
                      
                      {/* Bookmaker Section */}
                      <div className="bg-secondary text-white px-3 py-2" style={{ fontSize: '12px', fontWeight: '600' }}>
                        Bookmaker
                      </div>
                      
                      {/* Odds Table */}
                      <div className="card-body p-0">
                        {/* Team A Row */}
                        <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ 
                          backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
                          borderBottom: '1px solid #dee2e6'
                        }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>
                            {item.teamname_a || 'Team A'}
                          </span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            color: String(item.team_a).startsWith('-') ? '#dc3545' : '#28a745'
                          }}>
                            {isNaN(parseFloat(item.team_a)) ? item.team_a : parseFloat(item.team_a).toLocaleString('en-US', { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </span>
                        </div>
                        
                        {/* Team B Row */}
                        <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ 
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                          borderBottom: '1px solid #dee2e6'
                        }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>
                            {item.teamname_b || 'Team B'}
                          </span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            color: String(item.team_b).startsWith('-') ? '#dc3545' : '#28a745'
                          }}>
                            {isNaN(parseFloat(item.team_b)) ? item.team_b : parseFloat(item.team_b).toLocaleString('en-US', { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </span>
                        </div>
                        
                        {/* Draw Row */}
                        {item.draw !== '0' && (
                          <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ 
                            backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff'
                          }}>
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>
                              The Draw
                            </span>
                            <span style={{ 
                              fontSize: '13px', 
                      fontWeight: '600',
                              color: String(item.draw).startsWith('-') ? '#dc3545' : '#28a745'
                            }}>
                              {isNaN(parseFloat(item.draw)) ? item.draw : parseFloat(item.draw).toLocaleString('en-US', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Footer with Total Bets */}
                      <div className="card-footer bg-light text-center py-2" style={{ fontSize: '11px', color: '#6c757d' }}>
                        Total Bets: {item.total_bets} | {item.sport_name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Loading indicator for infinite scroll */}
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading more data...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading more data...</p>
                </div>
              )}

              {/* Empty State */}
              {displayData.length === 0 && !loading && (
                <div className="text-center py-5">
                  <h5 className="text-muted">No market analysis data available</h5>
                </div>
              )}

              
              
              {/* Info and Status */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                      
                      {hasMore && <span className="ms-2">(Scroll down to load more)</span>}
                    </div>
                    {loading && (
                      <div className="text-primary">
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Loading more data...
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
  );
}

export default AdminDashboard;
