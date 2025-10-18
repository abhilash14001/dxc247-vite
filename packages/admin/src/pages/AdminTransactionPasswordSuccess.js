import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTransactionPasswordChanged } from '@dxc247/shared/store/admin/adminSlice';
const AdminTransactionPasswordSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(setTransactionPasswordChanged());
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f8fb' }}>
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="text-center container">
          <h1>
            <span style={{ color: '#28a745' }}>
              Success! Your password has been updated successfully.
            </span>
          </h1>
          <h1>
            Your transaction password is{' '}
            <span 
              style={{ 
                color: '#17a2b8',
                backgroundColor: '#f8f9fa',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                fontFamily: 'monospace',
                fontSize: '1.2em'
              }}
            >
              {localStorage.getItem('transactionPassword') || 'N/A'}
            </span>
            .
          </h1>
          <h2>
            Please remember this transaction password, from now on all transaction of the website can be done only with this password and keep one thing in mind, do not share this password with anyone.
          </h2>
          <h2 style={{ marginTop: '1rem', color: '#343a40' }}>
            Thank you, Team {window.location.hostname}
          </h2>
          
          <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ marginTop: '3rem' }}>
              <span style={{ color: '#28a745' }}>
                Success! आपका पासवर्ड बदला जा चुका है।
              </span>
            </h1>
            <h1>
              आपका लेनदेन पासवर्ड{' '}
              <span 
                style={{ 
                  color: '#17a2b8',
                  backgroundColor: '#f8f9fa',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6',
                  fontFamily: 'monospace',
                  fontSize: '1.2em'
                }}
              >
                {localStorage.getItem('transactionPassword') || 'N/A'}
              </span>{' '}
              है।
            </h1>
            <h2>
              कृपया इस लेन-देन के पासवर्ड को याद रखें, अब से वेबसाइट के सभी हस्तांतरण केवल इस पासवर्ड से किए जा सकते हैं और एक बात का ध्यान रखें, इस पासवर्ड को किसी के साथ साझा न करें।
            </h2>
            <h2 style={{ marginTop: '1rem', color: '#343a40' }}>
              धन्यवाद, टीम {window.location.hostname}
            </h2>
          </div>
          
          <button 
            type="button" 
            onClick={handleBack}
            style={{
              backgroundColor: '#343a40',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '1.1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '3rem',
              minWidth: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionPasswordSuccess;
