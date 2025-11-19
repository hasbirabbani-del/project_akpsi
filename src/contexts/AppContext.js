// src/contexts/AppContext.js
import React, { createContext, useContext, useState } from "react";
import {
  packerLoginApi,
  assignWorkstationApi,
  scanHandlingUnitApi, // GET HU by code
  verifyItemApi, 
} from "../api/wmsApi";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const [session, setSession] = useState({
    packerId: null,
    workstationId: null,
    isRegistered: false,
  });

  const [currentHU, setCurrentHU] = useState(null);
  const [manualMode, setManualMode] = useState(false);

  // =========================
  // LOGIN → pakai API backend
  // =========================
  const login = async (username, password) => {
    try {
      const result = await packerLoginApi(username, password);
      // result:
      // {
      //   user: { id, username, full_name },
      //   access,
      //   refresh
      // }

      setIsAuthenticated(true);
      setCurrentUser({
        id: result.user?.id,
        username: result.user?.username,
        name: result.user?.full_name || result.user?.username || username,
      });
      setAccessToken(result.access);
      setRefreshToken(result.refresh || null);

      return { success: true, data: result };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message || "Login gagal" };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setSession({ packerId: null, workstationId: null, isRegistered: false });
    setCurrentHU(null);
    setManualMode(false);
  };

  // =====================================
  // ASSIGN WORKSTATION → pakai API backend
  // =====================================
  const registerWorkstation = async (packerId, workstationId) => {
    if (!packerId || !workstationId) {
      return {
        success: false,
        message: "Workstation dan Packer ID harus diisi",
      };
    }

    if (!accessToken) {
      return {
        success: false,
        message: "Belum login. Silakan login terlebih dahulu.",
      };
    }

    try {
      const result = await assignWorkstationApi(
        accessToken,
        workstationId,
        packerId // packer_username
      );

      // result:
      // {
      //   session_id,
      //   workstation_id,
      //   packer_username
      // }

      const newSession = {
        packerId: result.packer_username || packerId,
        workstationId: result.workstation_id || workstationId,
        isRegistered: true,
      };

      setSession(newSession);
      return { success: true, data: newSession };
    } catch (error) {
      console.error("Assign workstation error:", error);
      return {
        success: false,
        message: error.message || "Gagal assign workstation",
      };
    }
  };

  // Helper kecil buat SOP & IMEI
  const buildSopFromCategory = (category) => {
    switch (category) {
      case "Fragile":
        return [
          "Lapisi produk dengan bubble wrap minimal 3 lapis.",
          "Letakkan di tengah box, jangan menempel sisi box.",
          "Isi ruang kosong dengan kertas / foam pellet.",
          "Tempelkan stiker FRAGILE di luar karton.",
        ];
      case "Electronics":
        return [
          "Pastikan produk dalam kemasan asli jika tersedia.",
          "Gunakan bubble wrap tambahan di sisi luar.",
          "Jauhkan dari cairan / bahan berat lainnya.",
          "Jika butuh IMEI: pastikan IMEI sudah tercatat sebelum seal box.",
        ];
      default:
        return [
          "Pastikan produk dalam kondisi bersih dan kering.",
          "Gunakan box dengan ukuran yang pas.",
          "Isi ruang kosong agar produk tidak bergerak di dalam box.",
        ];
    }
  };

  const isSmartphoneCategory = (category) => {
    if (!category) return false;
    const low = String(category).toLowerCase();
    return low.includes("phone") || low.includes("smartphone");
  };

  // ====================================
  // SCAN HANDLING UNIT → pakai GET HU API
  // ====================================
  const scanHandlingUnit = async (huCode) => {
  if (!accessToken) {
    return {
      success: false,
      message: "Belum login. Silakan login terlebih dahulu.",
    };
  }
  if (!session?.workstationId) {
    return {
      success: false,
      message: "Workstation belum terdaftar. Daftarkan workstation dulu.",
    };
  }

  try {
    const raw = await scanHandlingUnitApi(accessToken, huCode);
    const huData = raw?.hu || raw;

    if (!huData || !huData.hu_code) {
      return {
        success: false,
        message: "Response Handling Unit tidak valid dari server.",
      };
    }

    const backendItems = Array.isArray(huData.items) ? huData.items : [];

    const mappedItems = backendItems.map((item, index) => {
      const requiresImei =
        item.category === "Electronics" ||
        String(item.category || "")
          .toLowerCase()
          .includes("smartphone");

      return {
        orderItemId: item.id ?? item.line_no ?? index + 1,
        name: item.name,
        qty: item.qty ?? 1,
        upc: item.barcode,
        sku: item.sku,
        skuId: item.sku,
        // ⬇️ KUNCI: kalau di backend sudah verified, kita anggap sudah success
        scanStatus: item.verified ? "success" : "pending",
        requiresImei,
        imeiSlots: requiresImei ? 1 : 0,
        imei: null,
        sop:
          item.category === "Fragile"
            ? [
                "Lapisi produk dengan bubble wrap minimal 3 lapis.",
                "Letakkan di tengah box, jangan menempel sisi box.",
                "Isi ruang kosong dengan kertas / foam pellet.",
                "Tempelkan stiker FRAGILE di luar karton.",
              ]
            : item.category === "Electronics"
            ? [
                "Pastikan produk dalam kemasan asli jika tersedia.",
                "Gunakan bubble wrap tambahan di sisi luar.",
                "Jauhkan dari cairan / bahan berat lainnya.",
                "Jika butuh IMEI: pastikan IMEI sudah tercatat sebelum seal box.",
              ]
            : [
                "Pastikan produk dalam kondisi bersih dan kering.",
                "Gunakan box dengan ukuran yang pas.",
                "Isi ruang kosong agar produk tidak bergerak di dalam box.",
              ],
      };
    });

    const totalQty = mappedItems.reduce(
      (sum, item) => sum + (item.qty || 0),
      0
    );

    const mappedHU = {
      hu: huData.hu_code,
      pickedBy: currentUser?.username || session.packerId || "-",
      packageCount: 1,
      totalQty,
      packageId: huData.id,
      clientName:
        huData.client != null ? `Client ID: ${huData.client}` : "Client ID: undefined",
      logistic: "",
      destCity: "",
      items: mappedItems,
      recommendations: {
        mode: "auto",
        boxes: [],
      },
    };

    setCurrentHU(mappedHU);
    setManualMode(false);

    return { success: true, data: mappedHU };
  } catch (error) {
    console.error("Scan HU error:", error);
    return {
      success: false,
      message: error.message || "Gagal mengambil data handling unit",
    };
  }
};


  // =========================
  // LOGIC SCAN ITEM & IMEI
  // =========================
  const scanItem = (orderItemId, scannedCode) => {
  if (!currentHU)
    return { success: false, message: "Tidak ada HU aktif" };

  const itemIndex = currentHU.items.findIndex(
    (item) => item.orderItemId === orderItemId
  );
  if (itemIndex === -1)
    return { success: false, message: "Item tidak ditemukan" };

  const item = currentHU.items[itemIndex];

  // cek barcode di frontend dulu
  if (scannedCode === item.upc || scannedCode === item.sku) {
    // update state lokal → UI langsung hijau
    const updatedItems = [...currentHU.items];
    updatedItems[itemIndex] = { ...item, scanStatus: "success" };
    setCurrentHU({ ...currentHU, items: updatedItems });

    // 🔥 kirim ke backend (fire & forget, biar UI tetap responsif)
    if (
      accessToken &&
      session?.workstationId &&
      (currentUser?.username || session.packerId)
    ) {
      const payload = {
        hu_code: currentHU.hu,
        barcode: scannedCode,
        username: currentUser?.username || session.packerId,
        workstation_id: session.workstationId,
      };

      verifyItemApi(accessToken, payload).catch((err) => {
        console.error("verifyItemApi failed:", err);
      });
    }

    return { success: true, message: "Scan produk berhasil" };
  }

  return {
    success: false,
    message: "Barcode tidak cocok dengan item ini",
  };
};


  const verifyImei = (orderItemId, imeiValues) => {
    if (!currentHU)
      return { success: false, message: "Tidak ada HU aktif" };

    const itemIndex = currentHU.items.findIndex(
      (item) => item.orderItemId === orderItemId
    );
    if (itemIndex === -1)
      return { success: false, message: "Item tidak ditemukan" };

    const item = currentHU.items[itemIndex];

    const validImeis = imeiValues.every((imei) => {
      return (
        imei.length >= 14 &&
        imei.length <= 16 &&
        /^\d+$/.test(imei)
      );
    });

    if (!validImeis) {
      return {
        success: false,
        message: "IMEI tidak valid. Harus 14-16 digit numerik.",
      };
    }

    const uniqueImeis = new Set(imeiValues);
    if (uniqueImeis.size !== imeiValues.length) {
      return {
        success: false,
        message: "IMEI tidak boleh duplikat",
      };
    }

    const updatedItems = [...currentHU.items];
    updatedItems[itemIndex] = {
      ...item,
      imei: {
        slots: item.imeiSlots,
        values: imeiValues,
        verified: true,
      },
    };
    setCurrentHU({ ...currentHU, items: updatedItems });
    return {
      success: true,
      message: "IMEI berhasil diverifikasi",
    };
  };

  const selectBox = (boxId) => {
    if (!currentHU || !currentHU.recommendations)
      return { success: false, message: "Tidak ada HU aktif" };

    const updatedBoxes = currentHU.recommendations.boxes.map((box) => {
      if (box.boxId === boxId) {
        return { ...box, status: "selected" };
      }
      return box;
    });

    setCurrentHU({
      ...currentHU,
      recommendations: {
        ...currentHU.recommendations,
        boxes: updatedBoxes,
      },
    });

    return { success: true };
  };

  const scanBox = (boxId, barcode) => {
    if (!currentHU || !currentHU.recommendations)
      return { success: false, message: "Tidak ada HU aktif" };

    const updatedBoxes = currentHU.recommendations.boxes.map((box) => {
      if (box.boxId === boxId) {
        return { ...box, scanned: true, barcode: barcode };
      }
      return box;
    });

    setCurrentHU({
      ...currentHU,
      recommendations: {
        ...currentHU.recommendations,
        boxes: updatedBoxes,
      },
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
          mode: newMode ? "manual" : "auto",
          boxes: newMode ? [] : currentHU.recommendations.boxes,
        },
      });
    }
  };

  const addManualBox = (barcode) => {
    if (!currentHU)
      return { success: false, message: "Tidak ada HU aktif" };

    const newBox = {
      boxId: `BX-MANUAL-${Date.now()}`,
      name: `Box (${barcode})`,
      innerDim: "Custom",
      capacityL: 0,
      location: "Manual Scan",
      status: "selected",
      specialHandlingTags: [],
      assignedItems: [],
      scanned: true,
      barcode: barcode,
      visualGuide: {
        title: "Panduan visual pengepakan",
        steps: [],
      },
    };

    const updatedBoxes = [
      ...(currentHU.recommendations?.boxes || []),
      newBox,
    ];

    setCurrentHU({
      ...currentHU,
      recommendations: {
        mode: "manual",
        boxes: updatedBoxes,
      },
    });

    return { success: true, data: newBox };
  };

  const reassignItemToBox = (itemId, boxId) => {
    if (!currentHU) return;

    const updatedBoxes = currentHU.recommendations.boxes.map((box) => {
      if (box.boxId === boxId) {
        if (!box.assignedItems.includes(itemId)) {
          return {
            ...box,
            assignedItems: [...box.assignedItems, itemId],
          };
        }
      } else {
        return {
          ...box,
          assignedItems: box.assignedItems.filter(
            (id) => id !== itemId
          ),
        };
      }
      return box;
    });

    setCurrentHU({
      ...currentHU,
      recommendations: {
        ...currentHU.recommendations,
        boxes: updatedBoxes,
      },
    });
  };

  const isSubmitEnabled = () => {
    if (!currentHU || !currentHU.recommendations) return false;

    const allItemsValid = currentHU.items.every((item) => {
      if (item.scanStatus !== "success") return false;
      if (item.requiresImei && !item.imei?.verified) return false;
      return true;
    });

    const selectedBoxes = currentHU.recommendations.boxes.filter(
      (box) => box.status === "selected"
    );
    const hasSelectedBox = selectedBoxes.length > 0;
    const allBoxesScanned = selectedBoxes.every(
      (box) => box.scanned === true
    );

    if (currentHU.recommendations.mode === "manual") {
      const allItemsAssigned = currentHU.items.every((item) =>
        selectedBoxes.some((box) =>
          box.assignedItems.includes(item.orderItemId)
        )
      );
      return (
        allItemsValid &&
        hasSelectedBox &&
        allBoxesScanned &&
        allItemsAssigned
      );
    }

    return allItemsValid && hasSelectedBox && allBoxesScanned;
  };

  const submitPackage = () => {
    if (!isSubmitEnabled()) {
      return {
        success: false,
        message: "Belum semua requirement terpenuhi",
      };
    }

    const selectedBoxes = currentHU.recommendations.boxes.filter(
      (box) => box.status === "selected"
    );

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
        mode: currentHU.recommendations.mode,
      },
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
    accessToken,
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
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
