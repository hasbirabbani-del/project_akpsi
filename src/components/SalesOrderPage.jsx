import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import RegisterWorkstationModal from './RegisterWorkstationModal';
import ScanHandlingUnit from './ScanHandlingUnit';
import ItemList from './ItemList';

const SalesOrderPage = () => {
  const { session, currentHU } = useApp();
  const [showRegisterModal, setShowRegisterModal] = useState(!session.isRegistered);

  const handleRegistrationSuccess = () => {
    setShowRegisterModal(false);
  };

  // Show registration modal if not registered
  if (!session.isRegistered || showRegisterModal) {
    return (
      <RegisterWorkstationModal
        onSuccess={handleRegistrationSuccess}
        onCancel={null}
      />
    );
  }

  // Show item list if HU is scanned
  if (currentHU) {
    return <ItemList />;
  }

  // Show scan HU screen by default
  return <ScanHandlingUnit />;
};

export default SalesOrderPage;
