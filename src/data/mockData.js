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
  {
    hu: 'HU-9911223344',
    salesOrder: 'SO-240011',
    packageId: 'PKG-5588',
    clientId: 'CL-ACME-001',
    clientName: 'GDN',
    logistic: 'JNE MAPAN',
    destCity: 'Kota Jakarta Pusat',
    pickedBy: 'Josua Logito',
    packageCount: 1,
    totalQty: 4,
    items: [
      {
        orderItemId: 'OI-001',
        sku: 'HP-POCO-X6',
        upc: '699329630118',
        skuId: 'MTA-0438669-00001',
        name: 'Smartphone POCO X6 8/256',
        qty: 1,
        requiresImei: true,
        imeiSlots: 2,
        attributes: { electronic: true, fragile: true },
        sop: ['Cek segel dus', 'Bubble Wrap 2 lapis', 'Charger terpisah'],
        specialHandling: ['Bubble Wrap'],
        scanStatus: 'pending',
        imei: { slots: 2, values: [], verified: false }
      },
      {
        orderItemId: 'OI-002',
        sku: 'ACC-CASE-01',
        upc: '699329630119',
        skuId: 'MTA-0438669-00002',
        name: 'Casing Silicone',
        qty: 2,
        requiresImei: false,
        attributes: { electronic: false, fragile: false },
        sop: ['Plastik zip', 'Gabung per 2 pcs'],
        specialHandling: [],
        scanStatus: 'pending'
      },
      {
        orderItemId: 'OI-003',
        sku: 'ACC-TEMPERED',
        upc: '699329630120',
        skuId: 'MTA-0438669-00003',
        name: 'Tempered Glass',
        qty: 1,
        requiresImei: false,
        attributes: { fragile: true },
        sop: ['Karton tipis pelindung', 'Sisipkan di sisi kiri box'],
        specialHandling: ['Plastic Wrap'],
        scanStatus: 'pending'
      }
    ],
    recommendations: {
      mode: 'auto',
      boxes: [
        {
          boxId: 'BX-002',
          name: 'Box Type 002',
          innerDim: '30×20×12 cm',
          capacityL: 7.2,
          location: 'Rack A3 • Lvl 2 • Slot 12',
          status: 'selected',
          specialHandlingTags: ['Bubble Wrap', 'Plastic Wrap'],
          assignedItems: ['OI-001', 'OI-002', 'OI-003'],
          scanned: false,
          barcode: null,
          visualGuide: {
            title: 'Panduan visual pengepakan',
            steps: [
              { number: 1, instruction: 'Lapisi barang dengan Bubble Wrap 2 lapis', image: 'bubble-wrap' },
              { number: 2, instruction: 'Letakkan barang rapuh di tengah box', image: 'center-placement' },
              { number: 3, instruction: 'Isi celah dengan dunnage', image: 'dunnage' },
              { number: 4, instruction: 'Segel dengan pola H', image: 'h-seal' },
              { number: 5, instruction: 'Tempel label pengiriman', image: 'label' }
            ]
          }
        }
      ]
    }
  },
  {
    hu: 'HU-8822114455',
    salesOrder: 'SO-240012',
    packageId: 'PKG-5589',
    clientId: 'CL-TECH-002',
    clientName: 'Tokopedia',
    logistic: 'SiCepat REG',
    destCity: 'Bandung',
    pickedBy: 'Siti Picker',
    packageCount: 2,
    totalQty: 4,
    items: [
      {
        orderItemId: 'OI-004',
        sku: 'LAPTOP-ASUS',
        upc: '699329630121',
        skuId: 'MTA-0438669-00004',
        name: 'Asus Vivobook 14',
        qty: 1,
        requiresImei: false,
        attributes: { electronic: true, fragile: true, heavy: true },
        sop: ['Bubble Wrap 3 lapis', 'Tambahkan foam di sudut'],
        specialHandling: ['Bubble Wrap', 'Foam Corner'],
        scanStatus: 'pending'
      },
      {
        orderItemId: 'OI-005',
        sku: 'ACC-MOUSE',
        upc: '699329630122',
        skuId: 'MTA-0438669-00005',
        name: 'Wireless Mouse',
        qty: 1,
        requiresImei: false,
        attributes: { electronic: true, fragile: false },
        sop: ['Baterai terpisah'],
        specialHandling: [],
        scanStatus: 'pending'
      },
      {
        orderItemId: 'OI-006',
        sku: 'ACC-CASE-01',
        upc: '699329630123',
        skuId: 'MTA-0438669-00006',
        name: 'Casing Silicone',
        qty: 2,
        requiresImei: false,
        attributes: { electronic: false, fragile: false },
        sop: ['Plastik zip', 'Gabung per 2 pcs'],
        specialHandling: [],
        scanStatus: 'pending'
      }
    ],
    recommendations: {
      mode: 'auto',
      boxes: [
        {
          boxId: 'BX-003',
          name: 'Box Type 003',
          innerDim: '40×30×15 cm',
          capacityL: 18.0,
          location: 'Rack B1 • Lvl 3 • Slot 5',
          status: 'selected',
          specialHandlingTags: ['Bubble Wrap', 'Foam Corner'],
          assignedItems: ['OI-004'],
          scanned: false,
          barcode: null,
          visualGuide: {
            title: 'Panduan visual pengepakan',
            steps: [
              { number: 1, instruction: 'Lapisi laptop dengan Bubble Wrap 3 lapis', image: 'bubble-wrap' },
              { number: 2, instruction: 'Tambahkan foam di semua sudut box', image: 'foam-corner' },
              { number: 3, instruction: 'Letakkan laptop di tengah dengan jarak dari sisi', image: 'center-placement' },
              { number: 4, instruction: 'Isi semua celah dengan dunnage', image: 'dunnage' },
              { number: 5, instruction: 'Segel dengan pola H', image: 'h-seal' },
              { number: 6, instruction: 'Tempel label pengiriman', image: 'label' }
            ]
          }
        },
        {
          boxId: 'BX-001',
          name: 'Box Type 001',
          innerDim: '20×15×10 cm',
          capacityL: 3.0,
          location: 'Rack A2 • Lvl 1 • Slot 8',
          status: 'selected',
          specialHandlingTags: [],
          assignedItems: ['OI-005', 'OI-006'],
          scanned: false,
          barcode: null,
          visualGuide: {
            title: 'Panduan visual pengepakan',
            steps: [
              { number: 1, instruction: 'Susun aksesori dengan rapi', image: 'arrange' },
              { number: 2, instruction: 'Isi celah dengan dunnage ringan', image: 'dunnage' },
              { number: 3, instruction: 'Segel dengan pola H', image: 'h-seal' },
              { number: 4, instruction: 'Tempel label pengiriman', image: 'label' }
            ]
          }
        }
      ]
    }
  }
];
