import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CasinoForm from './CasinoForm';

function AdminEditCasino() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSuccess = (casinoData) => {
    // Redirect to casino list after successful update
    navigate('/settings/casino-market');
  };

  const handleCancel = () => {
    // Redirect back to casino list
    navigate('/settings/casino-market');
  };

  return (
    <CasinoForm
      casinoId={id}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

export default AdminEditCasino;
