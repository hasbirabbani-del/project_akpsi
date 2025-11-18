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
  const [session, setSession] = useState({ packerId: null, workstationId: null, isRegistered: false, clientId: null });
  const [currentHU, setCurrentHU] = useState(null);
  const [recommendationsCache, setRecommendationsCache] = useState({ autoPlan: null, manualPlan: null });
  const [activeScanItemId, setActiveScanItemId] = useState(null);

  // Client packaging policies
  const [clientPolicies] = useState({
    "Tokopedia": {
      "allowedBoxTypes": ["Box Type 001", "Box Type 002", "Box Type 003"],
      "forbiddenMaterials": [],
      "defaultSopTags": ["Bubble Wrap"]
    },
    "Shopee": {
      "allowedBoxTypes": ["Box Type 001", "Box Type 003"],
      "forbiddenMaterials": ["Peanuts"],
      "defaultSopTags": ["Foam Corner"]
    },
    "Generic": {
      "allowedBoxTypes": ["Box Type 001", "Box Type 002", "Box Type 003", "Flute A"],
      "forbiddenMaterials": [],
      "defaultSopTags": []
    }
  });

  const login = (username) => {
    setIsAuthenticated(true);
    setCurrentUser({ username, name: username });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSession({ packerId: null, workstationId: null, isRegistered: false, clientId: null });
    setCurrentHU(null);
  };

  const registerWorkstation = (packerId, workstationId) => {
    // Require BOTH fields
    if (!packerId || !workstationId) {
      return { success: false, message: 'Workstation dan Packer ID harus diisi' };
    }

    // Validate workstation exists
    const workstation = MOCK_WORKSTATIONS.find(w => w.workstationId === workstationId);
    if (!workstation) {
      return { success: false, message: 'Workstation ID tidak valid' };
    }

    // Validate packer exists (optional - can accept any packer ID)
    const packer = MOCK_PACKERS.find(p => p.packerId === packerId);

    const newSession = {
      packerId: packerId,
      workstationId: workstationId,
      isRegistered: true,
      line: workstation.line
    };

    // Add packer data if found
    if (packer) {
      newSession.warehouse = packer.warehouse;
      newSession.shift = packer.shift;
      newSession.name = packer.name;
    }

    setSession(newSession);
    return { success: true, data: newSession };
  };

  const applyClientPolicy = (recommendations, clientId) => {
    const policy = clientPolicies[clientId] || clientPolicies['Generic'];
    
    // Filter boxes by allowed box types
    const filteredBoxes = recommendations.boxes.filter(box => {
      const boxType = box.boxType || box.name;
      return policy.allowedBoxTypes.includes(boxType);
    });
    
    // Apply defaultSopTags to each orderGroup
    const updatedBoxes = filteredBoxes.map(box => {
      const updatedOrderGroups = box.orderGroups?.map(og => {
        // Merge client defaultSopTags with existing sopTags (dedupe)
        const existingSopTags = og.sopTags || [];
        const combinedTags = [...new Set([...policy.defaultSopTags, ...existingSopTags])];
        
        return {
          ...og,
          sopTags: combinedTags
        };
      }) || [];
      
      return {
        ...box,
        orderGroups: updatedOrderGroups
      };
    });
    
    return {
      ...recommendations,
      boxes: updatedBoxes
    };
  };

  const scanHandlingUnit = (huCode) => {
    const hu = MOCK_HANDLING_UNITS.find(h => h.hu === huCode);
    if (hu) {
      const huCopy = JSON.parse(JSON.stringify(hu));
      
      // Set client ID from HU
      const clientId = huCopy.clientId || 'Generic';
      const previousClientId = session.clientId;
      
      // Apply client policy to recommendations
      const filteredRecommendations = applyClientPolicy(huCopy.recommendations, clientId);
      huCopy.recommendations = filteredRecommendations;
      
      // Update session with client ID
      setSession(prev => ({ ...prev, clientId }));
      
      // If clientId changed, clear manual cache
      const shouldClearManualCache = previousClientId && previousClientId !== clientId;
      
      // Initialize with auto plan as default
      setCurrentHU(huCopy);
      setRecommendationsCache({ 
        autoPlan: filteredRecommendations, 
        manualPlan: shouldClearManualCache ? null : recommendationsCache.manualPlan 
      });
      
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
    if (!currentHU) return { success: false, message: 'Tidak ada HU aktif' };
    
    const currentMode = currentHU.recommendations.mode;
    const newMode = currentMode === 'auto' ? 'manual' : 'auto';
    
    if (newMode === 'manual') {
      // Switching to manual: save current auto plan, restore manual plan
      const updatedCache = {
        autoPlan: JSON.parse(JSON.stringify(currentHU.recommendations)),
        manualPlan: recommendationsCache.manualPlan
      };
      
      const working = updatedCache.manualPlan || { mode: 'manual', boxes: [] };
      
      setRecommendationsCache(updatedCache);
      setCurrentHU({
        ...currentHU,
        recommendations: working
      });
      
      return { 
        success: true, 
        message: 'Mode manual aktif. Rekomendasi otomatis disimpan sementara.',
        mode: 'manual'
      };
    } else {
      // Switching to auto: save current manual plan, restore auto plan
      const updatedCache = {
        autoPlan: recommendationsCache.autoPlan,
        manualPlan: JSON.parse(JSON.stringify(currentHU.recommendations))
      };
      
      const working = updatedCache.autoPlan || JSON.parse(JSON.stringify(MOCK_HANDLING_UNITS.find(h => h.hu === currentHU.hu)?.recommendations || { mode: 'auto', boxes: [] }));
      
      setRecommendationsCache(updatedCache);
      setCurrentHU({
        ...currentHU,
        recommendations: working
      });
      
      return { 
        success: true, 
        message: 'Mode otomatis aktif. Rencana otomatis dipulihkan.',
        mode: 'auto'
      };
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
    const updatedRecommendations = {
      mode: 'manual',
      boxes: updatedBoxes
    };
    
    // Auto-save manual plan
    setRecommendationsCache(prev => ({
      ...prev,
      manualPlan: updatedRecommendations
    }));
    
    setCurrentHU({
      ...currentHU,
      recommendations: updatedRecommendations
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
    
    const updatedRecommendations = {
      ...currentHU.recommendations,
      boxes: updatedBoxes
    };
    
    // Auto-save manual plan when in manual mode
    if (currentHU.recommendations.mode === 'manual') {
      setRecommendationsCache(prev => ({
        ...prev,
        manualPlan: updatedRecommendations
      }));
    }
    
    setCurrentHU({
      ...currentHU,
      recommendations: updatedRecommendations
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

  const checkPolicyViolations = () => {
    if (!currentHU || currentHU.recommendations.mode !== 'manual') {
      return [];
    }

    const clientId = session.clientId || 'Generic';
    const policy = clientPolicies[clientId];
    const selectedBoxes = currentHU.recommendations.boxes.filter(box => box.status === 'selected');
    const violations = [];

    selectedBoxes.forEach(box => {
      const boxType = box.boxType || box.name;
      if (!policy.allowedBoxTypes.includes(boxType)) {
        violations.push({
          boxType,
          message: `Box ini tidak termasuk dalam daftar box yang diizinkan untuk klien ${clientId}`
        });
      }
    });

    return violations;
  };

  const submitPackage = () => {
    if (!isSubmitEnabled()) {
      return { success: false, message: 'Belum semua requirement terpenuhi' };
    }
    
    const selectedBoxes = currentHU.recommendations.boxes.filter(box => box.status === 'selected');
    const violations = checkPolicyViolations();
    
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
      },
      violations
    };
  };

  const startNewOrder = () => {
    setCurrentHU(null);
    setRecommendationsCache({ autoPlan: null, manualPlan: null });
  };

  const returnToScanHU = () => {
    // Reset HU and caches but keep session
    setCurrentHU(null);
    setRecommendationsCache({ autoPlan: null, manualPlan: null });
    setActiveScanItemId(null);
  };

  const setActiveScanItem = (itemId) => {
    setActiveScanItemId(itemId);
  };

  const value = {
    isAuthenticated,
    currentUser,
    session,
    currentHU,
    recommendationsCache,
    clientPolicies,
    activeScanItemId,
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
    startNewOrder,
    returnToScanHU,
    setActiveScanItem
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
