import React, { createContext, useContext, useState } from 'react';
import { MOCK_PACKERS, MOCK_HANDLING_UNITS, MOCK_WORKSTATIONS } from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState({ packerId: null, workstationId: null, isRegistered: false });
  const [currentHU, setCurrentHU] = useState(null);
  const [manualMode, setManualMode] = useState(false);

  const login = (username) => {
    setIsAuthenticated(true);
    setCurrentUser({ username, name: username });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSession({ packerId: null, workstationId: null, isRegistered: false });
    setCurrentHU(null);
    setManualMode(false);
  };

  const registerWorkstation = (packerId, workstationId) => {
    // Require at least one field
    if (!packerId && !workstationId) {
      return { success: false, message: 'Harap isi minimal satu field (Packer ID atau Workstation ID)' };
    }

    // Store whatever is provided
    const newSession = {
      packerId: packerId || null,
      workstationId: workstationId || null,
      isRegistered: true
    };

    // Get additional data if available
    if (packerId) {
      const packer = MOCK_PACKERS.find(p => p.packerId === packerId);
      if (packer) {
        newSession.warehouse = packer.warehouse;
        newSession.shift = packer.shift;
      }
    }

    if (workstationId) {
      const workstation = MOCK_WORKSTATIONS.find(w => w.workstationId === workstationId);
      if (workstation) {
        newSession.line = workstation.line;
      }
    }

    setSession(newSession);
    return { success: true, data: newSession };
  };

  const scanHandlingUnit = (huCode) => {
    const hu = MOCK_HANDLING_UNITS.find(h => h.hu === huCode);
    if (hu) {
      const huCopy = JSON.parse(JSON.stringify(hu));
      setCurrentHU(huCopy);
      setManualMode(false);
      return { success: true, data: huCopy };
    }
    return { success: false, message: 'Handling Unit tidak ditemukan atau tidak valid' };
  };

  const scanItem = (orderItemId, scannedCode) => {
    if (!currentHU) return { success: false, message: 'Tidak ada HU aktif' };
    
    const itemIndex = currentHU.items.findIndex(item => item.orderItemId === orderItemId);
    if (itemIndex === -1) return { success: false, message: 'Item tidak ditemukan' };
    
    const item = currentHU.items[itemIndex];
    
    if (scannedCode === item.upc || scannedCode === item.sku) {
      const updatedItems = [...currentHU.items];
      updatedItems[itemIndex] = { ...item, scanStatus: 'success' };
      setCurrentHU({ ...currentHU, items: updatedItems });
      return { success: true, message: 'Scan produk berhasil' };
    }
    
    return { success: false, message: 'Barcode tidak cocok dengan item ini' };
  };

  const verifyImei = (orderItemId, imeiValues) => {
    if (!currentHU) return { success: false, message: 'Tidak ada HU aktif' };
    
    const itemIndex = currentHU.items.findIndex(item => item.orderItemId === orderItemId);
    if (itemIndex === -1) return { success: false, message: 'Item tidak ditemukan' };
    
    const item = currentHU.items[itemIndex];
    
    const validImeis = imeiValues.every(imei => {
      return imei.length >= 14 && imei.length <= 16 && /^\d+$/.test(imei);
    });
    
    if (!validImeis) {
      return { success: false, message: 'IMEI tidak valid. Harus 14-16 digit numerik.' };
    }
    
    const uniqueImeis = new Set(imeiValues);
    if (uniqueImeis.size !== imeiValues.length) {
      return { success: false, message: 'IMEI tidak boleh duplikat' };
    }
    
    const updatedItems = [...currentHU.items];
    updatedItems[itemIndex] = {
      ...item,
      imei: { slots: item.imeiSlots, values: imeiValues, verified: true }
    };
    setCurrentHU({ ...currentHU, items: updatedItems });
    return { success: true, message: 'IMEI berhasil diverifikasi' };
  };

  const selectBox = (boxId) => {
    if (!currentHU || !currentHU.recommendations) return { success: false, message: 'Tidak ada HU aktif' };
    
    const updatedBoxes = currentHU.recommendations.boxes.map(box => {
      if (box.boxId === boxId) {
        return { ...box, status: 'selected' };
      }
      return box;
    });
    
    setCurrentHU({
      ...currentHU,
      recommendations: {
        ...currentHU.recommendations,
        boxes: updatedBoxes
      }
    });
    
    return { success: true };
  };

  const scanBox = (boxId, barcode) => {
    if (!currentHU || !currentHU.recommendations) return { success: false, message: 'Tidak ada HU aktif' };
    
    const updatedBoxes = currentHU.recommendations.boxes.map(box => {
      if (box.boxId === boxId) {
        return { ...box, scanned: true, barcode: barcode };
      }
      return box;
    });
    
    setCurrentHU({
      ...currentHU,
      recommendations: {
        ...currentHU.recommendations,
        boxes: updatedBoxes
      }
    });
    
    return { success: true };
  };

  const toggleManualMode = () => {
    const newMode = !manualMode;
    setManualMode(newMode);
    
    if (currentHU) {
      setCurrentHU({
        ...currentHU,
        recommendations: {
          ...currentHU.recommendations,
          mode: newMode ? 'manual' : 'auto',
          boxes: newMode ? [] : currentHU.recommendations.boxes
        }
      });
    }
  };

  const addManualBox = (barcode) => {
    if (!currentHU) return { success: false, message: 'Tidak ada HU aktif' };
    
    const newBox = {
      boxId: `BX-MANUAL-${Date.now()}`,
      name: `Box (${barcode})`,
      innerDim: 'Custom',
      capacityL: 0,
      location: 'Manual Scan',
      status: 'selected',
      specialHandlingTags: [],
      assignedItems: [],
      scanned: true,
      barcode: barcode,
      visualGuide: {
        title: 'Panduan visual pengepakan',
        steps: []
      }
    };
    
    const updatedBoxes = [...(currentHU.recommendations?.boxes || []), newBox];
    
    setCurrentHU({
      ...currentHU,
      recommendations: {
        mode: 'manual',
        boxes: updatedBoxes
      }
    });
    
    return { success: true, data: newBox };
  };

  const reassignItemToBox = (itemId, boxId) => {
    if (!currentHU) return;
    
    const updatedBoxes = currentHU.recommendations.boxes.map(box => {
      if (box.boxId === boxId) {
        if (!box.assignedItems.includes(itemId)) {
          return { ...box, assignedItems: [...box.assignedItems, itemId] };
        }
      } else {
        return { ...box, assignedItems: box.assignedItems.filter(id => id !== itemId) };
      }
      return box;
    });
    
    setCurrentHU({
      ...currentHU,
      recommendations: {
        ...currentHU.recommendations,
        boxes: updatedBoxes
      }
    });
  };

  const isSubmitEnabled = () => {
    if (!currentHU || !currentHU.recommendations) return false;
    
    const allItemsValid = currentHU.items.every(item => {
      if (item.scanStatus !== 'success') return false;
      if (item.requiresImei && !item.imei?.verified) return false;
      return true;
    });
    
    const selectedBoxes = currentHU.recommendations.boxes.filter(box => box.status === 'selected');
    const hasSelectedBox = selectedBoxes.length > 0;
    const allBoxesScanned = selectedBoxes.every(box => box.scanned === true);
    
    if (currentHU.recommendations.mode === 'manual') {
      const allItemsAssigned = currentHU.items.every(item => 
        selectedBoxes.some(box => box.assignedItems.includes(item.orderItemId))
      );
      return allItemsValid && hasSelectedBox && allBoxesScanned && allItemsAssigned;
    }
    
    return allItemsValid && hasSelectedBox && allBoxesScanned;
  };

  const submitPackage = () => {
    if (!isSubmitEnabled()) {
      return { success: false, message: 'Belum semua requirement terpenuhi' };
    }
    
    const selectedBoxes = currentHU.recommendations.boxes.filter(box => box.status === 'selected');
    
    return {
      success: true,
      data: {
        hu: currentHU.hu,
        salesOrder: currentHU.salesOrder,
        packageId: currentHU.packageId,
        clientName: currentHU.clientName,
        itemCount: currentHU.items.length,
        items: currentHU.items,
        boxes: selectedBoxes,
        mode: currentHU.recommendations.mode
      }
    };
  };

  const startNewOrder = () => {
    setCurrentHU(null);
    setManualMode(false);
  };

  const value = {
    isAuthenticated,
    currentUser,
    session,
    currentHU,
    manualMode,
    login,
    logout,
    registerWorkstation,
    scanHandlingUnit,
    scanItem,
    verifyImei,
    selectBox,
    scanBox,
    toggleManualMode,
    addManualBox,
    reassignItemToBox,
    isSubmitEnabled,
    submitPackage,
    startNewOrder
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
