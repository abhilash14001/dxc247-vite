import React from 'react';
import { useNavigate } from 'react-router-dom';
import CasinoForm from './CasinoForm';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';

function AdminCreateCasino() {
  const navigate = useNavigate();

  const handleSuccess = (casinoData) => {
    // Redirect to casino list after successful creation
    navigate(`${ADMIN_BASE_PATH}/settings/casino-market`);
  };

  const handleCancel = () => {
    // Redirect back to casino list
    navigate(`${ADMIN_BASE_PATH}/settings/casino-market`);
  };

  return (
    <CasinoForm
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

export default AdminCreateCasino;
