// src/contexts/AppContext.js
import React, { createContext, useContext, useState } from "react";
import {
  packerLoginApi,
  assignWorkstationApi,
  scanHandlingUnitApi, // GET HU by code
  verifyItemApi,
  recommendBoxApi,
} from "../api/wmsApi";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

// =========================
// Catalog box dari tabel
// =========================
const BOX_CATALOG = [
  { code: "001", size: [32.0, 18.0, 25.0], weight_g: 300, volume_cm3: 14400.0, type: "BOX" },
  { code: "002", size: [21.0, 18.0, 21.0], weight_g: 220, volume_cm3: 7938.0, type: "BOX" },
  { code: "003", size: [28.0, 21.0, 9.0],  weight_g: 220, volume_cm3: 5292.0, type: "BOX" },
  { code: "005", size: [35.0, 75.0, 0.1],  weight_g: 100, volume_cm3: 262.5, type: "BOX" },
  { code: "007", size: [41.0, 36.0, 38.0], weight_g: 490, volume_cm3: 56088.0, type: "BOX" },
  { code: "008", size: [33.0, 29.0, 33.0], weight_g: 660, volume_cm3: 31581.0, type: "BOX" },
  { code: "009", size: [16.5, 9.0, 8.0],  weight_g: 60,  volume_cm3: 1188.0, type: "BOX" },
  { code: "010", size: [16.0, 17.5, 6.5], weight_g: 120, volume_cm3: 1820.0, type: "BOX" },
  { code: "012", size: [28.5, 19.5, 5.5], weight_g: 180, volume_cm3: 3056.62, type: "BOX" },
  { code: "015", size: [16.0, 8.0, 4.0],  weight_g: 40,  volume_cm3: 512.0, type: "BOX" },
  { code: "025", size: [8.0, 8.0, 23.0],  weight_g: 40,  volume_cm3: 1472.0, type: "BOX" },
  { code: "026", size: [12.0, 12.0, 36.0], weight_g: 190, volume_cm3: 5184.0, type: "BOX" },
  { code: "027", size: [21.0, 27.0, 8.0],  weight_g: 140, volume_cm3: 4536.0, type: "BOX" },
  { code: "042", size: [32.0, 18.0, 21.0], weight_g: 130, volume_cm3: 12096.0, type: "BOX" },
  { code: "043", size: [21.0, 18.0, 21.0], weight_g: 100, volume_cm3: 7938.0, type: "BOX" },
  { code: "044", size: [42.0, 32.0, 18.0], weight_g: 670, volume_cm3: 24192.0, type: "BOX" },
  { code: "045", size: [13.0, 13.0, 39.0], weight_g: 100, volume_cm3: 6591.0, type: "BOX" },
  { code: "046", size: [49.0, 14.0, 26.0], weight_g: 220, volume_cm3: 17836.0, type: "BOX" },
  { code: "050", size: [33.0, 29.0, 28.0], weight_g: 320, volume_cm3: 26796.0, type: "BOX" },
  { code: "037", size: [23.0, 12.5, 0.1],  weight_g: 10,  volume_cm3: 28.75,  type: "ENVELOPE" },
  { code: "101", size: [33.0, 49.0, 0.1],  weight_g: 20,  volume_cm3: 12049.4, type: "PLASTIC" },
  { code: "102", size: [31.0, 17.0, 0.1],  weight_g: 10,  volume_cm3: 13175.0, type: "PLASTIC" },
  { code: "103", size: [60.0, 80.0, 0.1],  weight_g: 40,  volume_cm3: 24000.0, type: "PLASTIC" },
  { code: "104", size: [50.0, 40.0, 0.1],  weight_g: 30,  volume_cm3: 20000.0, type: "PLASTIC" },
];

const findBoxByCode = (code) => {
  if (code == null) return null;
  // samakan ke 3 digit, misal 7 → "007"
  const norm = String(code).padStart(3, "0");
  return BOX_CATALOG.find(
    (b) => String(b.code).padStart(3, "0") === norm
  );
};

// =========================
// =========================
// Visual guide steps (mock)
// =========================
const buildVisualGuideSteps = ({
  boxCode,
  clientName,
  needBubbleWrap,
  hasElectronics,
  hasFragile,
}) => {
  const steps = [];
  let n = 1;

  // Step 1 – siapkan box
  steps.push({
    number: n++,
    instruction: `Siapkan Box ${boxCode} milik client ${clientName} di area packing.`,
    image: "arrange", // icon susun barang
  });

  // Step 2 – bubble wrap (kalau perlu)
  if (needBubbleWrap || hasElectronics || hasFragile) {
    steps.push({
      number: n++,
      instruction:
        "Lapisi item elektronik / rapuh dengan Bubble Wrap 2–3 lapis sebelum dimasukkan ke box.",
      image: "bubble-wrap",
    });
  }

  // Step 3 – posisi di tengah
  steps.push({
    number: n++,
    instruction:
      "Letakkan item utama di tengah box dan beri jarak dari semua sisi dinding box.",
    image: "center-placement",
  });

  // Step 4 – isi celah
  steps.push({
    number: n++,
    instruction:
      "Isi semua celah dengan dunnage (kertas, foam pellet, atau plastik udara) sampai item tidak mudah bergeser.",
    image: "dunnage",
  });

  // Step 5 – segel
  steps.push({
    number: n++,
    instruction: "Tutup dan segel box menggunakan pola H di semua sambungan.",
    image: "h-seal",
  });

  // Step 6 – label
  steps.push({
    number: n++,
    instruction: "Tempel label pengiriman di bagian atas box, pastikan terbaca jelas.",
    image: "label",
  });

  return steps;
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
        packerId
      );

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

  // Helper SOP
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

  // =========================
  // AUTO REKOMENDASI BOX (ML)
  // =========================
  const autoRecommendBoxes = async (huSnapshot) => {
  const hu = huSnapshot || currentHU;
  if (!hu || !accessToken) return;

  // Jangan override kalau sudah ada box rekomendasi
  if (hu.recommendations?.boxes?.length) return;

  const allItemsValid = hu.items.every((item) => {
    if (item.scanStatus !== "success") return false;
    if (item.requiresImei && !item.imei?.verified) return false;
    return true;
  });

  if (!allItemsValid) return;

  try {
    const mlResp = await recommendBoxApi(accessToken, hu.hu);
    // bentuk baru:
    // {
    //   status, hu_code, client_name,
    //   recommendation: {
    //     mode, container_code,
    //     container: { code, size, weight_g, volume_cm3, type },
    //     need_bubble_wrap,
    //     bubble_wrap_items: [...]
    //   }
    // }
    const rec = mlResp.recommendation || mlResp;
    const clientName = mlResp.client_name || hu.clientName || "-";

    const container = rec.container || {};
    const rawCode = rec.container_code || container.code;
    const codeLabel = rawCode ? String(rawCode).padStart(3, "0") : "ML";

    // ambil dimensi & volume dari response; kalau tidak ada, fallback ke katalog lokal
    let dims = Array.isArray(container.size) ? container.size : null;
    let volumeCm3 =
      container.volume_cm3 != null ? container.volume_cm3 : null;

    if (!dims || volumeCm3 == null) {
      const boxSpec = findBoxByCode(rawCode);
      if (boxSpec) {
        if (!dims) dims = boxSpec.size;
        if (volumeCm3 == null) volumeCm3 = boxSpec.volume_cm3;
      }
    }

    // hitung kapasitas liter
    const capacityL =
      volumeCm3 != null
        ? Math.round((volumeCm3 / 1000) * 10) / 10 // satu angka desimal
        : 0;

    const innerDim = dims
      ? `Client Box: ${clientName} — ${dims[0]} × ${dims[1]} × ${dims[2]} cm`
      : `Client Box: ${clientName}`;

    const needBubbleWrap = !!rec.need_bubble_wrap;
    const bubbleItems = rec.bubble_wrap_items || [];
    // flag jenis item di HU
    const hasElectronics = hu.items.some(
      (it) =>
        it.requiresImei ||
        (it.name || "").toLowerCase().includes("laptop") ||
        (it.name || "").toLowerCase().includes("phone")
    );

    const hasFragile = hu.items.some(
      (it) =>
        (it.sop || []).some((s) => s.toLowerCase().includes("fragile")) ||
        (it.name || "").toLowerCase().includes("gelas") ||
        (it.name || "").toLowerCase().includes("kaca")
    );


    const bubbleSet = new Set(bubbleItems.map((it) => it.item_id));

    // tandai item mana yang butuh bubble wrap
    const itemsWithBubble = hu.items.map((it) => ({
      ...it,
      needsBubbleWrap: bubbleSet.has(it.orderItemId),
    }));

    const recommendedBox = {
      boxId: codeLabel,
      name: `Box ${codeLabel}`,
      innerDim,
      capacityL,
      location: "Area packing",
      status: "selected",
      scanned: false,
      barcode: codeLabel,
      bubbleWrap: needBubbleWrap,
      bubbleWrapItems: bubbleItems,
      specialHandlingTags: needBubbleWrap ? ["Perlu bubble wrap"] : [],
      assignedItems: hu.items.map((it) => it.orderItemId),
      visualGuide: {
        title: "Panduan visual pengepakan",
        steps: buildVisualGuideSteps({
          boxCode: codeLabel,
          clientName,
          needBubbleWrap,
          hasElectronics,
          hasFragile,
        }),
      },
    };


    const newHU = {
      ...hu,
      items: itemsWithBubble,
      recommendations: {
        mode: "auto",
        boxes: [recommendedBox],
      },
    };

    setCurrentHU(newHU);
  } catch (err) {
    console.error("recommendBoxApi error:", err);
  }
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
        const cat = item.category;
        const requiresImei =
          cat === "Electronics" || isSmartphoneCategory(cat);

        return {
          orderItemId: item.id ?? item.line_no ?? index + 1,
          name: item.name,
          qty: item.qty ?? 1,
          upc: item.barcode,
          sku: item.sku,
          skuId: item.sku,
          scanStatus: item.verified ? "success" : "pending",
          requiresImei,
          imeiSlots: requiresImei ? 1 : 0,
          imei: null,
          sop: buildSopFromCategory(cat),
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
          huData.client_name != null ? `${huData.client_name}` : "undefined",
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

      // kalau semua item sudah verified dari backend → langsung minta rekomendasi box
      autoRecommendBoxes(mappedHU);

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

    if (scannedCode === item.upc || scannedCode === item.sku) {
      const updatedItems = [...currentHU.items];
      updatedItems[itemIndex] = { ...item, scanStatus: "success" };

      const newHU = { ...currentHU, items: updatedItems };
      setCurrentHU(newHU);

      // fire & forget ke backend
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

      // kalau ini membuat semua item valid → minta rekomendasi box
      autoRecommendBoxes(newHU);

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
    const newHU = { ...currentHU, items: updatedItems };
    setCurrentHU(newHU);

    // setelah IMEI valid semua, coba minta rekomendasi box juga
    autoRecommendBoxes(newHU);

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

  if (!currentHU) return;

  // susun HU baru dengan mode yang di-toggle
  const nextHU = {
    ...currentHU,
    recommendations: {
      ...currentHU.recommendations,
      mode: newMode ? "manual" : "auto",
      // kalau manual → kosongin box, kalau auto → pakai yg ada dulu
      boxes: newMode ? [] : currentHU.recommendations.boxes,
    },
  };

  setCurrentHU(nextHU);

  // >>> IMPORTANT: kalau baru balik ke AUTO dan box masih kosong,
  // panggil lagi ML untuk generate rekomendasi
  if (!newMode) { // artinya dari manual -> auto
    const hasBoxes =
      Array.isArray(nextHU.recommendations.boxes) &&
      nextHU.recommendations.boxes.length > 0;

    if (!hasBoxes) {
      // ini pakai helper yang sudah kamu punya
      autoRecommendBoxes(nextHU);
    }
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
