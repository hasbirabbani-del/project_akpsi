// Mock data for warehouse QC & Packing prototype

export const MOCK_USERS = [
  { username: 'packer01', password: 'demo123', name: 'Ahmad Packer' },
  { username: 'packer02', password: 'demo123', name: 'Budi Packer' },
];

export const MOCK_PACKERS = [
  {
    packerId: 'PKR-0821',
    name: 'Ahmad Packer',
    warehouse: 'JKT-01',
    shift: 'Shift 1'
  },
  {
    packerId: 'PKR-0822',
    name: 'Budi Packer',
    warehouse: 'JKT-01',
    shift: 'Shift 1'
  }
];

export const MOCK_WORKSTATIONS = [
  {
    workstationId: 'WS-07',
    line: 'LINE-B'
  },
  {
    workstationId: 'WS-08',
    line: 'LINE-B'
  }
];

// Known box barcodes for validation
export const KNOWN_BOXES = {
  "BOX-BLB-001-A1": { clientId: "Blibli", boxType: "Box Type 001", dims: "20×15×10 cm" },
  "BOX-TKP-002-B1": { clientId: "Tokopedia", boxType: "Box Type 002", dims: "30×20×12 cm" },
  "BOX-SHP-001-X": { clientId: "Shopee", boxType: "Box Type 001", dims: "20×15×10 cm" },
  "BOX-GEN-002-C1": { clientId: "Generic", boxType: "Box Type 002", dims: "30×20×12 cm" }
};

export const MOCK_HANDLING_UNITS = [
  // HU #1: Blibli - Beng-Beng & SilverQueen (1 order, 1 box)
  {
    hu: 'HU-8811223344',
    clientId: 'Blibli',
    salesOrder: 'SO-240017',
    packageId: 'PKG-BL-5594',
    clientName: 'Blibli',
    logistic: 'Anteraja',
    destCity: 'Jakarta',
    pickedBy: 'Blibli Picker',
    packageCount: 1,
    totalQty: 2,
    logistics: { courier: 'Anteraja', service: 'REG' },
    receiver: { 
      name: 'Dimas', 
      phone: '08xxxxxxxxxx', 
      address: 'Jl. Kebun Raya No. 8, Jakarta, 10110' 
    },
    sender: { 
      name: 'Gudang SBS', 
      phone: '08xxxxxxxxxx', 
      address: 'IDC, Jakarta' 
    },
    items: [
      {
        orderItemId: 'BL-001-A',
        orderId: 'OI-BL-0001',
        sku: 'BLB-BENG20',
        upc: '8991102750001',
        skuId: 'BLB-BENG20',
        name: 'Beng-Beng Chocolate Wafer 20g',
        brand: 'Beng-Beng',
        qty: 1,
        requiresImei: false,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 001',
        attributes: { fragile: false },
        sop: ['Bubble Wrap (tipis)'],
        specialHandling: [],
        scanStatus: 'pending'
      },
      {
        orderItemId: 'BL-001-B',
        orderId: 'OI-BL-0001',
        sku: 'BLB-SQ58',
        upc: '8991102111058',
        skuId: 'BLB-SQ58',
        name: 'SilverQueen Milk Chocolate 58g',
        brand: 'SilverQueen',
        qty: 1,
        requiresImei: false,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 001',
        attributes: { fragile: false },
        sop: ['Bubble Wrap (tipis)'],
        specialHandling: [],
        scanStatus: 'pending'
      }
    ],
    recommendations: {
      mode: 'auto',
      boxes: [
        {
          boxId: 'BX-001-BLIBLI-1',
          boxType: 'Box Type 001',
          innerDim: '20×15×10 cm',
          capacityL: 3,
          location: 'Rack A1 • Lvl 1 • Slot 3',
          status: 'selected',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-BL-0001'],
              items: [
                { sku: 'BLB-BENG20', name: 'Beng-Beng Chocolate Wafer 20g', qty: 1 },
                { sku: 'BLB-SQ58', name: 'SilverQueen Milk Chocolate 58g', qty: 1 }
              ],
              sopTags: ['Bubble Wrap'],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Bubble Wrap tipis untuk makanan', image: 'bubble-wrap' },
                  { number: 2, instruction: 'Segel dengan pola H', image: 'h-seal' }
                ]
              }
            }
          ]
        }
      ]
    }
  },

  // HU #2: Tokopedia - 2× Braven Parfum (1 order, 1 box)
  {
    hu: 'HU-7711882299',
    clientId: 'Tokopedia',
    salesOrder: 'SO-240018',
    packageId: 'PKG-TK-5595',
    clientName: 'Tokopedia',
    logistic: 'SiCepat',
    destCity: 'Jakarta',
    pickedBy: 'Tokopedia Picker',
    packageCount: 1,
    totalQty: 2,
    logistics: { courier: 'SiCepat', service: 'HALU' },
    receiver: { 
      name: 'Sinta', 
      phone: '08xxxxxxxxxx', 
      address: 'Jl. Sudirman No. 10, Jakarta, 12190' 
    },
    sender: { 
      name: 'Gudang SBS', 
      phone: '08xxxxxxxxxx', 
      address: 'IDC, Jakarta' 
    },
    items: [
      {
        orderItemId: 'TK-9002-P1',
        orderId: 'OI-TK-9002',
        sku: 'TKP-BRVN50',
        upc: '8999900123456',
        skuId: 'TKP-BRVN50',
        name: 'Braven Eau de Parfum 50ml',
        brand: 'Braven',
        qty: 2,
        requiresImei: false,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 002',
        attributes: { fragile: true },
        sop: ['Bubble Wrap 3 lapis', 'Fragile'],
        specialHandling: ['Bubble Wrap', 'Foam Corner'],
        scanStatus: 'pending'
      }
    ],
    recommendations: {
      mode: 'auto',
      boxes: [
        {
          boxId: 'BX-002-TKP-1',
          boxType: 'Box Type 002',
          innerDim: '30×20×12 cm',
          capacityL: 7.2,
          location: 'Rack B2 • Lvl 2 • Slot 4',
          status: 'selected',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-TK-9002'],
              items: [
                { sku: 'TKP-BRVN50', name: 'Braven Eau de Parfum 50ml', qty: 2 }
              ],
              sopTags: ['Bubble Wrap'],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Lapisi dengan Bubble Wrap 3 lapis', image: 'bubble-wrap' },
                  { number: 2, instruction: 'Tambahkan Foam Corner', image: 'foam-corner' },
                  { number: 3, instruction: 'Segel dengan pola H', image: 'h-seal' }
                ]
              }
            }
          ]
        }
      ]
    }
  },

  // HU #3: Lazada (Unknown client - falls back to Generic) with IMEI
  {
    hu: 'HU-6600112299',
    clientId: 'Lazada',
    salesOrder: 'SO-240019',
    packageId: 'PKG-LZ-7001',
    clientName: 'Lazada',
    logistic: 'JNE',
    destCity: 'Bandung',
    pickedBy: 'Generic Picker',
    packageCount: 1,
    totalQty: 1,
    logistics: { courier: 'JNE', service: 'REG' },
    receiver: { 
      name: 'Rafi', 
      phone: '08xxxxxxxxxx', 
      address: 'Jl. Asia Afrika No. 12, Bandung, 40111' 
    },
    sender: { 
      name: 'SBS Warehouse', 
      phone: '08xxxxxxxxxx', 
      address: 'IDC, Jakarta' 
    },
    items: [
      {
        orderItemId: 'LZ-7001-PHONE',
        orderId: 'OI-LZ-7001',
        sku: 'IP15-128-BLK',
        upc: '194253123456',
        skuId: 'IP15-128-BLK',
        name: 'Apple iPhone 15 128GB',
        brand: 'Apple',
        qty: 1,
        requiresImei: true,
        imeiSlots: 2,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 002',
        attributes: { electronic: true, fragile: true },
        sop: ['3-layer Bubble Wrap', 'Fragile'],
        specialHandling: ['Bubble Wrap'],
        scanStatus: 'pending',
        imei: { slots: 2, values: [], verified: false }
      }
    ],
    recommendations: {
      mode: 'auto',
      boxes: [
        {
          boxId: 'BX-002-GEN-1',
          boxType: 'Box Type 002',
          innerDim: '30×20×12 cm',
          capacityL: 7.2,
          location: 'Rack C1 • Lvl 2 • Slot 6',
          status: 'selected',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-LZ-7001'],
              items: [
                { sku: 'IP15-128-BLK', name: 'Apple iPhone 15 128GB', qty: 1 }
              ],
              sopTags: ['Bubble Wrap'],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Lapisi dengan Bubble Wrap 3 lapis', image: 'bubble-wrap' },
                  { number: 2, instruction: 'Segel dengan pola H', image: 'h-seal' }
                ]
              }
            }
          ]
        }
      ]
    }
  }
];
