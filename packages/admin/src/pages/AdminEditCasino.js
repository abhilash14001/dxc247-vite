import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CasinoForm from './CasinoForm';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';

function AdminEditCasino() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSuccess = (casinoData) => {
    // Redirect to casino list after successful update
    navigate(`${ADMIN_BASE_PATH}/settings/casino-market`);
  };

  const handleCancel = () => {
    // Redirect back to casino list
    navigate(`${ADMIN_BASE_PATH}settings/casino-market`);
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
