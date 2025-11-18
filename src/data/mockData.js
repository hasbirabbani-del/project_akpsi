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

export const MOCK_HANDLING_UNITS = [
  // HU #1: Tokopedia (phones + accessories, multi-box, IMEI)
  {
    hu: 'HU-9911223344',
    clientId: 'Tokopedia',
    salesOrder: 'SO-240011',
    packageId: 'PKG-5588',
    clientName: 'Tokopedia',
    logistic: 'JNE MAPAN',
    destCity: 'Kota Jakarta Pusat',
    pickedBy: 'Josua Logito',
    packageCount: 2,
    totalQty: 4,
    items: [
      {
        orderItemId: 'OI-001-S24',
        orderId: 'OI-001',
        sku: 'SM-S921',
        upc: '880609001234',
        skuId: 'MTA-0438669-00001',
        name: 'Samsung Galaxy S24 8/256',
        brand: 'Samsung',
        qty: 1,
        requiresImei: true,
        imeiSlots: 2,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 003',
        attributes: { electronic: true, fragile: true },
        sop: ['Cek segel dus', 'Bubble Wrap 2 lapis', 'Charger terpisah'],
        specialHandling: ['Bubble Wrap', 'Foam Corner'],
        scanStatus: 'pending',
        imei: { slots: 2, values: [], verified: false }
      },
      {
        orderItemId: 'OI-001-CASE',
        orderId: 'OI-001',
        sku: 'ACC-CASE-SM',
        upc: '880609005678',
        skuId: 'MTA-0438669-00002',
        name: 'Silicone Case',
        brand: 'Generic',
        qty: 1,
        requiresImei: false,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 003',
        attributes: { electronic: false, fragile: false },
        sop: ['Plastik zip'],
        specialHandling: [],
        scanStatus: 'pending'
      },
      {
        orderItemId: 'OI-002-IP15',
        orderId: 'OI-002',
        sku: 'IPHON-15-128',
        upc: '194253001234',
        skuId: 'MTA-0438669-00003',
        name: 'iPhone 15 [128 GB]',
        brand: 'Apple',
        qty: 1,
        requiresImei: true,
        imeiSlots: 1,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 002',
        attributes: { electronic: true, fragile: true },
        sop: ['Cek segel dus', 'Bubble Wrap 3 lapis', 'Accessories terpisah'],
        specialHandling: ['Bubble Wrap', 'Foam Corner'],
        scanStatus: 'pending',
        imei: { slots: 1, values: [], verified: false }
      },
      {
        orderItemId: 'OI-002-CHRG',
        orderId: 'OI-002',
        sku: 'ACC-WRLCHG',
        upc: '194253005678',
        skuId: 'MTA-0438669-00004',
        name: 'Wireless Charger',
        brand: 'Generic',
        qty: 1,
        requiresImei: false,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 002',
        attributes: { electronic: true, fragile: false },
        sop: ['Plastik zip'],
        specialHandling: [],
        scanStatus: 'pending'
      }
    ],
    recommendations: {
      mode: 'auto',
      boxes: [
        {
          boxId: 'BX-003',
          boxType: 'Box Type 003',
          innerDim: '40×30×15 cm',
          capacityL: 18,
          location: 'Rack B1 • Lvl 3 • Slot 5',
          status: 'selected',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-001'],
              items: [
                { sku: 'SM-S921', name: 'Samsung Galaxy S24 8/256', qty: 1 },
                { sku: 'ACC-CASE-SM', name: 'Silicone Case', qty: 1 }
              ],
              sopTags: [],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Lapisi dengan Bubble Wrap 2 lapis', image: 'bubble-wrap' },
                  { number: 2, instruction: 'Tambahkan Foam Corner di sudut', image: 'foam-corner' },
                  { number: 3, instruction: 'Letakkan di tengah box', image: 'center-placement' },
                  { number: 4, instruction: 'Segel dengan pola H', image: 'h-seal' },
                  { number: 5, instruction: 'Tempel label pengiriman', image: 'label' }
                ]
              }
            }
          ]
        },
        {
          boxId: 'BX-002',
          boxType: 'Box Type 002',
          innerDim: '30×20×12 cm',
          capacityL: 7.2,
          location: 'Rack A3 • Lvl 2 • Slot 12',
          status: 'selected',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-002'],
              items: [
                { sku: 'IPHON-15-128', name: 'iPhone 15 [128 GB]', qty: 1 },
                { sku: 'ACC-WRLCHG', name: 'Wireless Charger', qty: 1 }
              ],
              sopTags: [],
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

  // HU #2: Shopee (shoes, filters Box Type 002)
  {
    hu: 'HU-5544332211',
    clientId: 'Shopee',
    salesOrder: 'SO-240012',
    packageId: 'PKG-5589',
    clientName: 'Shopee',
    logistic: 'J&T Express',
    destCity: 'Surabaya',
    pickedBy: 'Andi Picker',
    packageCount: 1,
    totalQty: 2,
    items: [
      {
        orderItemId: 'OI-101-NIKE',
        orderId: 'OI-101',
        sku: 'NIKE-AM270',
        upc: '193151234567',
        skuId: 'MTA-0438669-00101',
        name: 'Nike Air Max 270',
        brand: 'Nike',
        qty: 1,
        requiresImei: false,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 003',
        attributes: { fragile: false },
        sop: ['Wrap dengan kertas tissue', 'Plastik zip per pasang'],
        specialHandling: [],
        scanStatus: 'pending'
      },
      {
        orderItemId: 'OI-102-ADIDAS',
        orderId: 'OI-102',
        sku: 'ADIDAS-UB22',
        upc: '4062345678901',
        skuId: 'MTA-0438669-00102',
        name: 'Adidas Ultraboost 22',
        brand: 'Adidas',
        qty: 1,
        requiresImei: false,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 001',
        attributes: { fragile: false },
        sop: ['Wrap dengan kertas tissue', 'Plastik zip per pasang'],
        specialHandling: [],
        scanStatus: 'pending'
      }
    ],
    recommendations: {
      mode: 'auto',
      boxes: [
        {
          boxId: 'BX-003',
          boxType: 'Box Type 003',
          innerDim: '40×30×15 cm',
          capacityL: 18,
          location: 'Rack B1 • Lvl 3 • Slot 5',
          status: 'selected',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-101'],
              items: [
                { sku: 'NIKE-AM270', name: 'Nike Air Max 270', qty: 1 }
              ],
              sopTags: [],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Wrap sepatu dengan tissue', image: 'arrange' },
                  { number: 2, instruction: 'Plastik zip', image: 'dunnage' },
                  { number: 3, instruction: 'Segel dengan pola H', image: 'h-seal' }
                ]
              }
            }
          ]
        },
        {
          boxId: 'BX-001',
          boxType: 'Box Type 001',
          innerDim: '20×15×10 cm',
          capacityL: 3,
          location: 'Rack A2 • Lvl 1 • Slot 8',
          status: 'available',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-102'],
              items: [
                { sku: 'ADIDAS-UB22', name: 'Adidas Ultraboost 22', qty: 1 }
              ],
              sopTags: [],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Wrap sepatu dengan tissue', image: 'arrange' },
                  { number: 2, instruction: 'Segel dengan pola H', image: 'h-seal' }
                ]
              }
            }
          ]
        },
        // Box Type 002 should be filtered out by Shopee policy
        {
          boxId: 'BX-002',
          boxType: 'Box Type 002',
          innerDim: '30×20×12 cm',
          capacityL: 7.2,
          location: 'Rack A3 • Lvl 2 • Slot 12',
          status: 'available',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-101', 'OI-102'],
              items: [
                { sku: 'NIKE-AM270', name: 'Nike Air Max 270', qty: 1 },
                { sku: 'ADIDAS-UB22', name: 'Adidas Ultraboost 22', qty: 1 }
              ],
              sopTags: [],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Susun sepatu', image: 'arrange' },
                  { number: 2, instruction: 'Segel', image: 'h-seal' }
                ]
              }
            }
          ]
        }
      ]
    }
  },

  // HU #3: Tokopedia (10 orders merged, identical powerbanks)
  {
    hu: 'HU-7722334455',
    clientId: 'Tokopedia',
    salesOrder: 'SO-240013',
    packageId: 'PKG-5590',
    clientName: 'Tokopedia',
    logistic: 'SiCepat REG',
    destCity: 'Bandung',
    pickedBy: 'Siti Picker',
    packageCount: 1,
    totalQty: 10,
    items: [
      ...Array.from({ length: 10 }, (_, i) => ({
        orderItemId: `OI-${201 + i}-PB`,
        orderId: `OI-${201 + i}`,
        sku: 'PWR-10K',
        upc: '628176543210',
        skuId: `MTA-0438669-00${201 + i}`,
        name: 'Powerbank 10000mAh',
        brand: 'Generic',
        qty: 1,
        requiresImei: false,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 001',
        attributes: { electronic: true, fragile: false },
        sop: ['Plastik zip', 'Susun rapi'],
        specialHandling: [],
        scanStatus: 'pending'
      }))
    ],
    recommendations: {
      mode: 'auto',
      boxes: [
        {
          boxId: 'BX-001',
          boxType: 'Box Type 001',
          innerDim: '20×15×10 cm',
          capacityL: 3,
          location: 'Rack A2 • Lvl 1 • Slot 8',
          status: 'selected',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: Array.from({ length: 10 }, (_, i) => `OI-${201 + i}`),
              items: [
                { sku: 'PWR-10K', name: 'Powerbank 10000mAh', qty: 1 }
              ],
              sopTags: [],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Susun semua powerbank dengan rapi', image: 'arrange' },
                  { number: 2, instruction: 'Lapisi dengan Bubble Wrap', image: 'bubble-wrap' },
                  { number: 3, instruction: 'Segel dengan pola H', image: 'h-seal' },
                  { number: 4, instruction: 'Tempel label pengiriman', image: 'label' }
                ]
              }
            }
          ]
        }
      ]
    }
  },

  // HU #4: Generic fallback (UnknownVendor)
  {
    hu: 'HU-6600221100',
    clientId: 'UnknownVendor',
    salesOrder: 'SO-240014',
    packageId: 'PKG-5591',
    clientName: 'UnknownVendor',
    logistic: 'Pos Indonesia',
    destCity: 'Yogyakarta',
    pickedBy: 'Budi Picker',
    packageCount: 1,
    totalQty: 2,
    items: [
      {
        orderItemId: 'OI-301-FLOUR',
        orderId: 'OI-301',
        sku: 'BOGA-KB-1KG',
        upc: '899123456789',
        skuId: 'MTA-0438669-00301',
        name: 'Bogasari Kunci Biru Tepung Terigu [1 kg]',
        brand: 'Bogasari',
        qty: 1,
        requiresImei: false,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 001',
        attributes: { fragile: false },
        sop: ['Plastik zip', 'Hindari air'],
        specialHandling: [],
        scanStatus: 'pending'
      },
      {
        orderItemId: 'OI-302-POCO',
        orderId: 'OI-302',
        sku: 'POCO-X6',
        upc: '699329630118',
        skuId: 'MTA-0438669-00302',
        name: 'POCO X6 8/256',
        brand: 'POCO',
        qty: 1,
        requiresImei: true,
        imeiSlots: 2,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 002',
        attributes: { electronic: true, fragile: true },
        sop: ['Cek segel dus', 'Bubble Wrap 2 lapis'],
        specialHandling: ['Bubble Wrap'],
        scanStatus: 'pending',
        imei: { slots: 2, values: [], verified: false }
      }
    ],
    recommendations: {
      mode: 'auto',
      boxes: [
        {
          boxId: 'BX-001',
          boxType: 'Box Type 001',
          innerDim: '20×15×10 cm',
          capacityL: 3,
          location: 'Rack A2 • Lvl 1 • Slot 8',
          status: 'selected',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-301'],
              items: [
                { sku: 'BOGA-KB-1KG', name: 'Bogasari Kunci Biru Tepung Terigu [1 kg]', qty: 1 }
              ],
              sopTags: [],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Plastik zip untuk tepung', image: 'dunnage' },
                  { number: 2, instruction: 'Segel dengan pola H', image: 'h-seal' }
                ]
              }
            }
          ]
        },
        {
          boxId: 'BX-002',
          boxType: 'Box Type 002',
          innerDim: '30×20×12 cm',
          capacityL: 7.2,
          location: 'Rack A3 • Lvl 2 • Slot 12',
          status: 'selected',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-302'],
              items: [
                { sku: 'POCO-X6', name: 'POCO X6 8/256', qty: 1 }
              ],
              sopTags: [],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Lapisi dengan Bubble Wrap', image: 'bubble-wrap' },
                  { number: 2, instruction: 'Segel dengan pola H', image: 'h-seal' }
                ]
              }
            }
          ]
        }
      ]
    }
  },

  // HU-SIMPLE-ONE: Single order, single box (Tokopedia)
  {
    hu: 'HU-1000000001',
    clientId: 'Tokopedia',
    salesOrder: 'SO-240015',
    packageId: 'PKG-5592',
    clientName: 'Tokopedia',
    logistic: 'JNE REG',
    destCity: 'Jakarta',
    pickedBy: 'Simple Picker',
    packageCount: 1,
    totalQty: 1,
    items: [
      {
        orderItemId: 'OI-9001-FLOUR',
        orderId: 'OI-9001',
        sku: 'BOGA-KB-1KG',
        upc: '899123456789',
        skuId: 'MTA-0438669-09001',
        name: 'Bogasari Kunci Biru Tepung Terigu [1 kg]',
        brand: 'Bogasari',
        qty: 1,
        requiresImei: false,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 001',
        attributes: { fragile: false },
        sop: ['Plastik zip', 'Hindari air'],
        specialHandling: [],
        scanStatus: 'pending'
      }
    ],
    recommendations: {
      mode: 'auto',
      boxes: [
        {
          boxId: 'BX-001-S1',
          boxType: 'Box Type 001',
          innerDim: '20×15×10 cm',
          capacityL: 3,
          location: 'Rack A1 • Lvl 1 • Slot 3',
          status: 'selected',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-9001'],
              items: [
                { sku: 'BOGA-KB-1KG', name: 'Bogasari Kunci Biru Tepung Terigu [1 kg]', qty: 1 }
              ],
              sopTags: [],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Plastik zip untuk tepung', image: 'dunnage' },
                  { number: 2, instruction: 'Segel dengan pola H', image: 'h-seal' }
                ]
              }
            }
          ]
        }
      ]
    }
  },

  // HU-SIMPLE-MULTI: Single order, multiple box alternatives (Tokopedia)
  {
    hu: 'HU-1000000002',
    clientId: 'Tokopedia',
    salesOrder: 'SO-240016',
    packageId: 'PKG-5593',
    clientName: 'Tokopedia',
    logistic: 'JNE REG',
    destCity: 'Jakarta',
    pickedBy: 'Simple Picker',
    packageCount: 1,
    totalQty: 1,
    items: [
      {
        orderItemId: 'OI-9002-S24',
        orderId: 'OI-9002',
        sku: 'SM-S921',
        upc: '880609001234',
        skuId: 'MTA-0438669-09002',
        name: 'Samsung Galaxy S24 8/256',
        brand: 'Samsung',
        qty: 1,
        requiresImei: true,
        imeiSlots: 2,
        image: '/assets/products/placeholder.png',
        boxHint: 'Box Type 003',
        attributes: { electronic: true, fragile: true },
        sop: ['Cek segel dus', 'Bubble Wrap 2 lapis'],
        specialHandling: ['Bubble Wrap', 'Foam Corner'],
        scanStatus: 'pending',
        imei: { slots: 2, values: [], verified: false }
      }
    ],
    recommendations: {
      mode: 'auto',
      boxes: [
        {
          boxId: 'BX-003-S2',
          boxType: 'Box Type 003',
          innerDim: '40×30×15 cm',
          capacityL: 18,
          location: 'Rack B1 • Lvl 3 • Slot 5',
          status: 'selected',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-9002'],
              items: [
                { sku: 'SM-S921', name: 'Samsung Galaxy S24 8/256', qty: 1 }
              ],
              sopTags: [],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Lapisi dengan Bubble Wrap', image: 'bubble-wrap' },
                  { number: 2, instruction: 'Tambahkan Foam Corner', image: 'foam-corner' },
                  { number: 3, instruction: 'Segel dengan pola H', image: 'h-seal' }
                ]
              }
            }
          ]
        },
        {
          boxId: 'BX-001-S2',
          boxType: 'Box Type 001',
          innerDim: '20×15×10 cm',
          capacityL: 3,
          location: 'Rack A2 • Lvl 1 • Slot 8',
          status: 'available',
          scanned: false,
          barcode: null,
          orderGroups: [
            {
              orderIds: ['OI-9002'],
              items: [
                { sku: 'SM-S921', name: 'Samsung Galaxy S24 8/256', qty: 1 }
              ],
              sopTags: [],
              visualGuide: {
                title: 'Panduan visual pengepakan',
                steps: [
                  { number: 1, instruction: 'Lapisi dengan Bubble Wrap', image: 'bubble-wrap' },
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
