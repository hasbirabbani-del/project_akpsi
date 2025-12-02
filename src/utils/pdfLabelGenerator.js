import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';

// Generate barcode as base64 image
const generateBarcode = (value) => {
  try {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, value, {
      format: 'CODE128',
      width: 2,
      height: 60,
      displayValue: false,
      margin: 0
    });
    return canvas.toDataURL('image/png');
  } catch (e) {
    console.error('Barcode generation failed:', e);
    return null;
  }
};

// Build tracking number
const buildTracking = (orderId, boxId, clientId) => {
  const prefix = clientId === 'Tokopedia' ? 'TKSC' : clientId === 'Shopee' ? 'SPXID' : clientId === 'Blibli' ? 'BLB' : 'AWB';
  const orderNum = orderId.split('-').pop() || '00000';
  const boxNum = boxId.split('-').pop() || '001';
  return `${prefix}-${orderNum}${boxNum}`;
};

// Mock data helpers
const mockCourier = (clientId) => {
  const couriers = {
    'Tokopedia': 'SiCepat',
    'Shopee': 'J&T Express',
    'Blibli': 'Anteraja',
    'Generic': 'JNE'
  };
  return couriers[clientId] || 'JNE';
};

const mockService = (clientId) => {
  const services = {
    'Tokopedia': 'HALU',
    'Shopee': 'REG',
    'Blibli': 'REG',
    'Generic': 'REG'
  };
  return services[clientId] || 'REG';
};

const mockCost = (weightKg) => {
  return Math.ceil(weightKg * 15000);
};

const calcWeight = (items) => {
  // Assume 0.5 kg per item
  return items.length * 0.5;
};

// Tokopedia Shipping Label (100×150mm Portrait) - Matches uploaded PDF design
const renderTokopediaLabel = (doc, labelData, pageNum, totalPages) => {
  const { tracking, serviceName, courierName, weightKg, receiver, sender, orderId } = labelData;
  
  // Outer border
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(3, 3, 94, 144);
  
  // 1. Header Section (y 5-12mm)
  // Tokopedia logo (left)
  doc.setTextColor(0, 150, 0); // Green color
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('tokopedia', 6, 10);
  
  // Invoice number (right)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(6);
  doc.setFont(undefined, 'normal');
  doc.text(`INV/20240726/MPL/${orderId}`, 94, 10, { align: 'right' });
  
  // Separator line
  doc.setLineWidth(0.2);
  doc.line(6, 13, 94, 13);
  
  // 2. Tracking Code Section (y 15-24mm)
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(tracking, 50, 20, { align: 'center' });
  
  // Box around tracking code
  doc.setLineWidth(0.3);
  doc.rect(20, 16, 60, 7);
  
  // 3. Barcode Section (y 26-50mm)
  const barcodeImg = generateBarcode(tracking);
  if (barcodeImg) {
    doc.addImage(barcodeImg, 'PNG', 10, 26, 80, 22);
  }
  
  // 4. Service Details Section (y 52-72mm)
  // Left column - Service icons and labels
  doc.setFontSize(6);
  doc.setFont(undefined, 'normal');
  
  // Layanan row with icon box
  doc.setLineWidth(0.2);
  doc.rect(6, 52, 4, 4);
  doc.setFontSize(5);
  doc.setFont(undefined, 'bold');
  doc.text('Layanan:', 12, 55);
  doc.setFont(undefined, 'normal');
  doc.text('Drop Off', 28, 55);
  
  doc.setFont(undefined, 'bold');
  doc.text('Kurir Rekomendasi:', 12, 60);
  doc.setFont(undefined, 'normal');
  doc.text('Reguler', 38, 60);
  
  doc.setFont(undefined, 'bold');
  doc.text('Berat:', 12, 65);
  doc.setFont(undefined, 'normal');
  doc.text(`${weightKg} Kg`, 24, 65);
  
  // 5. Courier Boxes (y 74-88mm)
  // Drop off ke box
  doc.setLineWidth(0.3);
  doc.rect(6, 74, 42, 8);
  doc.setFontSize(5);
  doc.setFont(undefined, 'normal');
  doc.text('Drop off ke:', 8, 78);
  doc.setFontSize(6);
  doc.setFont(undefined, 'bold');
  doc.text(courierName.toUpperCase(), 8, 82);
  
  // Diantar oleh box
  doc.rect(52, 74, 42, 8);
  doc.setFontSize(5);
  doc.setFont(undefined, 'normal');
  doc.text('Diantar oleh:', 54, 78);
  doc.setFontSize(6);
  doc.setFont(undefined, 'bold');
  doc.text(courierName.toUpperCase(), 54, 82);
  
  // 6. Address Section (y 92-130mm)
  // Receiver (left column)
  doc.setFontSize(6);
  doc.setFont(undefined, 'bold');
  doc.text('Penerima:', 6, 92);
  
  doc.setFontSize(7);
  const receiverNameLines = doc.splitTextToSize(receiver.name, 50);
  doc.text(receiverNameLines[0], 6, 97);
  
  doc.setFontSize(6);
  doc.setFont(undefined, 'normal');
  doc.text(receiver.phone, 6, 102);
  
  doc.setFontSize(5.5);
  const receiverAddressLines = doc.splitTextToSize(receiver.address, 50);
  doc.text(receiverAddressLines.slice(0, 5), 6, 106);
  
  // Sender (right column)
  doc.setFontSize(6);
  doc.setFont(undefined, 'bold');
  doc.text('Pengirim:', 58, 92);
  
  doc.setFontSize(7);
  const senderNameLines = doc.splitTextToSize(sender.name, 38);
  doc.text(senderNameLines[0], 58, 97);
  
  doc.setFontSize(6);
  doc.setFont(undefined, 'normal');
  doc.text(sender.phone, 58, 102);
  
  doc.setFontSize(5.5);
  const senderAddressLines = doc.splitTextToSize(sender.address, 38);
  doc.text(senderAddressLines.slice(0, 4), 58, 106);
  
  // 7. Footer Section (y 132-144mm)
  // Non Tunai box (left)
  doc.setLineWidth(0.3);
  doc.rect(6, 132, 42, 10);
  doc.setFontSize(7);
  doc.setFont(undefined, 'bold');
  doc.text('Non Tunai', 27, 138, { align: 'center' });
  
  // Note box (right)
  doc.rect(52, 132, 42, 10);
  doc.setFontSize(5);
  doc.setFont(undefined, 'normal');
  const noteText = doc.splitTextToSize('Penjual tidak perlu bayar apapun ke kurir', 38);
  doc.text(noteText, 73, 137, { align: 'center' });
  
  // Page number
  if (totalPages > 1) {
    doc.setFontSize(5);
    doc.text(`Hal. ${pageNum}/${totalPages}`, 94, 145, { align: 'right' });
  }
};

// Unified Best-Practice Shipping Label v1 (100×150mm Portrait)
const renderBestPracticeLabel = (doc, labelData, pageNum, totalPages) => {
  const { tracking, serviceName, courierName, weightKg, shippingCost, codAmount, receiver, sender, items, orderId, hu, clientId } = labelData;
  
  // Safe margins: 5mm (work area 90×140mm)
  const margin = 5;
  const workWidth = 90;
  
  // 1. Header strip (y 6-18): Client + Meta
  doc.setFontSize(7);
  doc.setFont(undefined, 'bold');
  doc.text(clientId.toUpperCase(), margin, 10);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(5);
  const now = new Date();
  doc.text(`Order: ${orderId}`, 95, 8, { align: 'right' });
  doc.text(`Tanggal: ${now.toLocaleDateString('id-ID')}`, 95, 11, { align: 'right' });
  doc.text(`HU: ${hu}`, 95, 14, { align: 'right' });
  
  // 2. Tracking line (y 20-28): Big AWB/Resi
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(tracking, 50, 24, { align: 'center' });
  
  doc.setLineWidth(0.2);
  doc.line(margin, 26, margin + workWidth, 26);
  
  // 3. Primary barcode (y 30-58): CODE128
  const barcodeImg = generateBarcode(tracking);
  if (barcodeImg) {
    // Quiet zone ≥ 3.5mm, barcode width ≈83mm
    doc.addImage(barcodeImg, 'PNG', margin + 3.5, 30, 83, 26);
  }
  
  // HRI (Human Readable Interpretation) below barcode
  doc.setFontSize(6);
  doc.setFont(undefined, 'normal');
  doc.text(tracking, 50, 59, { align: 'center' });
  
  // 4. Service grid (y 60-74): 4 columns
  doc.setFontSize(5);
  doc.setFont(undefined, 'bold');
  
  // Column headers
  const colWidth = workWidth / 4;
  doc.text('Courier', margin + 2, 63);
  doc.text('Service', margin + colWidth + 2, 63);
  doc.text('Berat', margin + colWidth * 2 + 2, 63);
  doc.text(codAmount > 0 ? 'COD' : 'Ongkir', margin + colWidth * 3 + 2, 63);
  
  // Grid
  doc.setLineWidth(0.1);
  doc.rect(margin, 60, workWidth, 14);
  for (let i = 1; i <= 3; i++) {
    doc.line(margin + colWidth * i, 60, margin + colWidth * i, 74);
  }
  doc.line(margin, 65, margin + workWidth, 65);
  
  // Values
  doc.setFont(undefined, 'normal');
  doc.text(courierName, margin + 2, 69);
  doc.text(serviceName, margin + colWidth + 2, 69);
  doc.text(`${weightKg} kg`, margin + colWidth * 2 + 2, 69);
  doc.text(codAmount > 0 ? `Rp ${codAmount.toLocaleString('id-ID')}` : `Rp ${shippingCost.toLocaleString('id-ID')}`, margin + colWidth * 3 + 2, 69);
  
  // 5. Receiver block (y 76-104)
  doc.setFontSize(6);
  doc.setFont(undefined, 'bold');
  doc.text('PENERIMA', margin, 78);
  
  doc.setFontSize(10);
  doc.text(receiver.name.toUpperCase(), margin, 84);
  
  doc.setFontSize(6);
  doc.setFont(undefined, 'normal');
  doc.text(receiver.phone, margin, 89);
  
  doc.setFontSize(5.5);
  const receiverLines = doc.splitTextToSize(receiver.address.toUpperCase(), workWidth - 5);
  doc.text(receiverLines.slice(0, 3), margin, 93);
  
  // 6. Sender block (y 106-126)
  doc.setFontSize(6);
  doc.setFont(undefined, 'bold');
  doc.text('PENGIRIM', margin, 108);
  
  doc.setFontSize(9);
  doc.text(sender.name, margin, 114);
  
  doc.setFontSize(5.5);
  doc.setFont(undefined, 'normal');
  doc.text(sender.phone, margin, 118);
  
  const senderLines = doc.splitTextToSize(sender.address, workWidth - 5);
  doc.text(senderLines.slice(0, 2), margin, 122);
  
  // 7. Footer band (y 128-144)
  // Secondary barcode for Order/Package
  const orderBarcode = generateBarcode(orderId);
  if (orderBarcode) {
    doc.addImage(orderBarcode, 'PNG', margin, 128, 40, 10);
  }
  
  // QR code placeholder (18×18mm)
  doc.setFontSize(4);
  doc.text(`QR: ${clientId}-${orderId}-${hu}`, 75, 135, { align: 'center' });
  doc.rect(66, 128, 18, 18);
  
  // Note
  doc.setFontSize(4);
  doc.setFont(undefined, 'italic');
  doc.text('Penjual tidak perlu bayar apapun ke kurir', 50, 143, { align: 'center' });
  
  // Page number
  if (totalPages > 1) {
    doc.setFontSize(4);
    doc.text(`Hal. ${pageNum}/${totalPages}`, 95, 147, { align: 'right' });
  }
};

// Legacy Tokopedia Label Template (Landscape - 150x100mm) - DEPRECATED
const renderTokopedia = (doc, labelData, pageNum, totalPages) => {
  const { tracking, serviceName, courierName, weightKg, shippingCost, codAmount, receiver, sender, items, orderId } = labelData;
  
  // Outer black border (1pt, inset 2mm)
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(2, 2, 146, 96);
  
  // Top row (y≈5-12mm)
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.text('tokopedia', 5, 8);
  
  doc.setFontSize(3);
  doc.setFont(undefined, 'normal');
  doc.text(`INV/20240301/MPL/${orderId}`, 145, 8, { align: 'right' });
  
  // Tracking band (centered, bold, y≈14-20mm)
  doc.setFontSize(7);
  doc.setFont(undefined, 'bold');
  doc.text(tracking, 75, 17, { align: 'center' });
  doc.setLineWidth(0.1);
  doc.line(20, 19, 130, 19);
  
  // Main CODE128 barcode (width ≈136mm, height ≈26mm, y≈22-48mm)
  const barcodeImg = generateBarcode(tracking);
  if (barcodeImg) {
    doc.addImage(barcodeImg, 'PNG', 7, 22, 136, 26);
  }
  
  // Service grid (y≈50-62mm) - 4 columns
  doc.setFontSize(4);
  doc.setFont(undefined, 'normal');
  
  // Column 1: Courier logo + Layanan
  doc.rect(7, 50, 33, 12);
  doc.text('Layanan:', 9, 54);
  doc.text('Drop Off', 9, 58);
  
  // Column 2: Service name
  doc.rect(40, 50, 33, 12);
  doc.setFont(undefined, 'bold');
  doc.text(`${courierName}`, 42, 54);
  doc.text(serviceName, 42, 58);
  
  // Column 3: Weight
  doc.rect(73, 50, 33, 12);
  doc.setFont(undefined, 'normal');
  doc.text('Berat:', 75, 54);
  doc.setFont(undefined, 'bold');
  doc.text(`${weightKg} Kg`, 75, 58);
  
  // Column 4: Shipping cost
  doc.rect(106, 50, 37, 12);
  doc.setFont(undefined, 'normal');
  doc.text('Ongkir:', 108, 54);
  doc.setFont(undefined, 'bold');
  doc.text(`Rp ${shippingCost.toLocaleString('id-ID')}`, 108, 58);
  
  // Receiver & Sender boxes (y≈64-86mm)
  // Left box - Receiver
  doc.setFont(undefined, 'bold');
  doc.setFontSize(4);
  doc.text('Penerima:', 7, 66);
  doc.rect(7, 67, 68, 19);
  
  doc.setFontSize(5);
  doc.text(receiver.name.substring(0, 20), 9, 71);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(4);
  doc.text(receiver.phone, 9, 75);
  const receiverLines = doc.splitTextToSize(receiver.address, 64);
  doc.text(receiverLines.slice(0, 3), 9, 78);
  
  // Right box - Sender
  doc.setFont(undefined, 'bold');
  doc.setFontSize(4);
  doc.text('Pengirim:', 78, 66);
  doc.rect(78, 67, 65, 19);
  
  doc.setFontSize(5);
  doc.text(sender.name.substring(0, 20), 80, 71);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(4);
  doc.text(sender.phone, 80, 75);
  const senderLines = doc.splitTextToSize(sender.address, 61);
  doc.text(senderLines.slice(0, 3), 80, 78);
  
  // Bottom strip (y≈88-96mm)
  // Left: COD box
  if (codAmount > 0) {
    doc.rect(7, 88, 35, 8);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(5);
    doc.text(`COD: Rp ${codAmount.toLocaleString('id-ID')}`, 9, 93);
  }
  
  // Right: Note box
  doc.setFont(undefined, 'italic');
  doc.setFontSize(3.5);
  doc.text('Penjual tidak perlu bayar apapun ke kurir', 75, 93, { align: 'center' });
  
  // Page number
  if (totalPages > 1) {
    doc.setFontSize(3);
    doc.text(`Hal. ${pageNum}/${totalPages}`, 143, 96, { align: 'right' });
  }
};

// Shopee Label Template
const renderShopee = (doc, labelData, pageNum, totalPages) => {
  const { tracking, serviceName, courierName, weightKg, shippingCost, codAmount, receiver, sender, items } = labelData;
  
  // Top band
  doc.setFillColor(255, 87, 34);
  doc.rect(0, 0, 100, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text(`${serviceName} - ${courierName}`, 50, 7, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  // Resi Number
  doc.setFontSize(9);
  doc.text('No. Resi:', 10, 18);
  
  // Barcode
  const barcodeImg = generateBarcode(tracking);
  if (barcodeImg) {
    doc.addImage(barcodeImg, 'PNG', 15, 22, 70, 18);
  }
  
  doc.setFontSize(12);
  doc.text(tracking, 50, 47, { align: 'center' });
  
  // Receiver
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.text('PENERIMA:', 10, 57);
  doc.setFont(undefined, 'normal');
  doc.text(receiver.name, 10, 62);
  doc.text(receiver.phone, 10, 66);
  const receiverLines = doc.splitTextToSize(receiver.address, 80);
  doc.text(receiverLines, 10, 70);
  
  // Sender
  doc.setFont(undefined, 'bold');
  doc.text('PENGIRIM:', 10, 88);
  doc.setFont(undefined, 'normal');
  doc.text(sender.name, 10, 93);
  doc.text(sender.phone, 10, 97);
  const senderLines = doc.splitTextToSize(sender.address, 80);
  doc.text(senderLines, 10, 101);
  
  // Product Table
  doc.setFontSize(7);
  doc.setFont(undefined, 'bold');
  doc.text('Produk', 10, 118);
  doc.text('Qty', 80, 118, { align: 'right' });
  doc.setFont(undefined, 'normal');
  
  let yPos = 123;
  items.slice(0, 3).forEach((item, idx) => {
    doc.text(item.name.substring(0, 30), 10, yPos);
    doc.text(item.qty.toString(), 80, yPos, { align: 'right' });
    yPos += 4;
  });
  
  // Weight/COD
  doc.setFontSize(8);
  doc.text(`Berat: ${weightKg} kg | ${codAmount > 0 ? `COD: Rp ${codAmount.toLocaleString('id-ID')}` : 'Non-COD'}`, 10, 138);
  
  // Page number
  if (totalPages > 1) {
    doc.setFontSize(7);
    doc.text(`Hal. ${pageNum}/${totalPages}`, 90, 147, { align: 'right' });
  }
};

// Blibli Label Template (Portrait - 100x150mm)
const renderBlibli = (doc, labelData, pageNum, totalPages) => {
  const { tracking, serviceName, courierName, weightKg, receiver, sender, items, orderId, hu, clientId } = labelData;
  
  // Header (y≈6-14mm)
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text('blibli.com', 6, 10);
  
  // Right side: icon placeholders + captions
  doc.setFontSize(3);
  doc.setFont(undefined, 'normal');
  const now = new Date();
  doc.text(`Date: ${now.toLocaleDateString('id-ID')}`, 70, 8);
  doc.text(`Order ID: ${orderId}`, 70, 11);
  
  // Courier badge row (y≈16-22mm)
  doc.setFillColor(230, 230, 230);
  doc.rect(6, 16, 88, 6, 'F');
  doc.setFontSize(5);
  doc.setFont(undefined, 'bold');
  doc.text(`${courierName.toUpperCase()}`, 8, 20);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(3.5);
  doc.text(`${courierName} ${serviceName}`, 40, 20);
  
  // AWB barcode band (y≈24-42mm)
  doc.setFontSize(4);
  doc.text('Airway Bill:', 8, 26);
  
  const barcodeImg = generateBarcode(tracking);
  if (barcodeImg) {
    doc.addImage(barcodeImg, 'PNG', 8, 28, 84, 14);
  }
  doc.setFontSize(6);
  doc.setFont(undefined, 'bold');
  doc.text(tracking, 50, 45, { align: 'center' });
  
  // Recipient block (y≈48-70mm)
  doc.setFontSize(5);
  doc.setFont(undefined, 'bold');
  doc.text('Kepada:', 8, 50);
  
  doc.setFontSize(6);
  doc.text(receiver.name.substring(0, 25), 8, 55);
  
  doc.setFontSize(4);
  doc.setFont(undefined, 'normal');
  const receiverLines = doc.splitTextToSize(receiver.address, 60);
  doc.text(receiverLines.slice(0, 4), 8, 59);
  
  // Shipping Notes (right side)
  doc.setFontSize(3.5);
  doc.setFont(undefined, 'bold');
  doc.text('Shipping Notes:', 72, 50);
  doc.setFont(undefined, 'normal');
  doc.text('Handle with care', 72, 54);
  
  // Divider with item count
  doc.setLineWidth(0.1);
  doc.line(8, 74, 92, 74);
  doc.setFontSize(4);
  doc.setFont(undefined, 'bold');
  doc.text(`Jumlah Barang: ${items.length}`, 8, 78);
  
  // Lower band (y≈72-96mm)
  // Package ID barcode (left)
  doc.setFontSize(3.5);
  doc.text('Package ID:', 8, 82);
  const pkgBarcode = generateBarcode(orderId);
  if (pkgBarcode) {
    doc.addImage(pkgBarcode, 'PNG', 8, 84, 35, 8);
  }
  
  // Note area (right)
  doc.setFontSize(3);
  doc.setFont(undefined, 'italic');
  const noteLines = doc.splitTextToSize('Terima kasih telah berbelanja di Blibli. Barang yang sudah dibeli tidak dapat dikembalikan.', 40);
  doc.text(noteLines, 55, 85);
  
  // Product table (y≈98-140mm)
  doc.setFontSize(3.5);
  doc.setFont(undefined, 'bold');
  doc.text('Order', 8, 100);
  doc.text('Item ID', 8, 103);
  
  doc.text('Nama Produk', 24, 100);
  
  doc.text('Merchant', 52, 100);
  doc.text('SKU', 52, 103);
  
  doc.text('Item SKU', 68, 100);
  
  doc.text('Qty', 84, 100);
  
  doc.text('Berat', 90, 100);
  
  // Table border
  doc.setLineWidth(0.1);
  doc.rect(8, 104, 86, items.length * 6 + 2);
  
  // Horizontal lines
  for (let i = 0; i <= items.length; i++) {
    doc.line(8, 104 + i * 6, 94, 104 + i * 6);
  }
  
  // Vertical lines
  doc.line(22, 104, 22, 104 + items.length * 6 + 2);
  doc.line(50, 104, 50, 104 + items.length * 6 + 2);
  doc.line(66, 104, 66, 104 + items.length * 6 + 2);
  doc.line(82, 104, 82, 104 + items.length * 6 + 2);
  doc.line(88, 104, 88, 104 + items.length * 6 + 2);
  
  // Fill table data
  doc.setFont(undefined, 'normal');
  let yPos = 108;
  items.slice(0, 5).forEach((item) => {
    doc.text((item.orderItemId || '-').substring(0, 10), 9, yPos);
    doc.text(item.name.substring(0, 18), 24, yPos);
    doc.text(item.sku.substring(0, 10), 52, yPos);
    doc.text(item.sku.substring(0, 10), 68, yPos);
    doc.text(item.qty.toString(), 84, yPos);
    doc.text('0.5', 90, yPos);
    yPos += 6;
  });
  
  // Tiny QR bottom-right (y≈142-148mm)
  doc.setFontSize(2.5);
  doc.text(`QR: ${clientId}-${orderId}-${hu}`, 70, 145);
  // QR would go here with a QR library
  
  // Page number
  if (totalPages > 1) {
    doc.setFontSize(3);
    doc.text(`Hal. ${pageNum}/${totalPages}`, 92, 148, { align: 'right' });
  }
};

// Generic Label Template
const renderGeneric = (doc, labelData, pageNum, totalPages) => {
  const { tracking, serviceName, courierName, weightKg, shippingCost, receiver, sender, items } = labelData;
  
  // Barcode
  const barcodeImg = generateBarcode(tracking);
  if (barcodeImg) {
    doc.addImage(barcodeImg, 'PNG', 15, 10, 70, 20);
  }
  
  doc.setFontSize(12);
  doc.text(tracking, 50, 37, { align: 'center' });
  
  // Service
  doc.setFontSize(9);
  doc.text(`${courierName} - ${serviceName}`, 50, 44, { align: 'center' });
  
  // Receiver
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.text('PENERIMA:', 10, 54);
  doc.setFont(undefined, 'normal');
  doc.text(receiver.name, 10, 59);
  doc.text(receiver.phone, 10, 63);
  const receiverLines = doc.splitTextToSize(receiver.address, 80);
  doc.text(receiverLines, 10, 67);
  
  // Sender
  doc.setFont(undefined, 'bold');
  doc.text('PENGIRIM:', 10, 85);
  doc.setFont(undefined, 'normal');
  doc.text(sender.name, 10, 90);
  doc.text(sender.phone, 10, 94);
  const senderLines = doc.splitTextToSize(sender.address, 80);
  doc.text(senderLines, 10, 98);
  
  // Products
  doc.setFontSize(7);
  doc.setFont(undefined, 'bold');
  doc.text('Produk:', 10, 115);
  doc.setFont(undefined, 'normal');
  let yPos = 120;
  items.slice(0, 3).forEach((item) => {
    doc.text(`${item.name} (${item.qty}x)`, 10, yPos);
    yPos += 4;
  });
  
  doc.text(`Berat: ${weightKg} kg`, 10, yPos + 2);
  
  // Page number
  if (totalPages > 1) {
    doc.setFontSize(7);
    doc.text(`Hal. ${pageNum}/${totalPages}`, 90, 147, { align: 'right' });
  }
};

// Main PDF generation function
export const generatePdfLabels = ({ orderId, handlingUnit, session, boxes, items }) => {
  try {
    const clientId = session.clientId || 'Generic';
    const selectedBoxes = boxes.filter(box => box.status === 'selected' && box.scanned);
    
    // If no boxes, create default
    if (selectedBoxes.length === 0) {
      selectedBoxes.push({
        boxId: 'DEFAULT-001',
        boxType: 'Default Box',
        scanned: true
      });
    }
    
    // Create PDF - Unified format (100×150mm Portrait)
    const doc = new jsPDF({
      unit: 'mm',
      format: [100, 150],
      orientation: 'portrait'
    });
    
    const totalPages = selectedBoxes.length;
    
    selectedBoxes.forEach((box, index) => {
      if (index > 0) doc.addPage();
      
      const tracking = buildTracking(orderId, box.boxId, clientId);
      const weightKg = calcWeight(items);
      const shippingCost = mockCost(weightKg);
      
      const labelData = {
        orderId,
        hu: handlingUnit.hu,
        clientId,
        tracking,
        serviceName: handlingUnit.logistics?.service || mockService(clientId),
        courierName: handlingUnit.logistics?.courier || mockCourier(clientId),
        weightKg,
        shippingCost,
        codAmount: 0,
        receiver: {
          name: handlingUnit.receiver?.name || 'Nama Penerima',
          phone: handlingUnit.receiver?.phone || '08xxxxxxxxxx',
          address: handlingUnit.receiver?.address || 'Alamat lengkap penerima'
        },
        sender: {
          name: handlingUnit.sender?.name || 'Gudang SBS',
          phone: handlingUnit.sender?.phone || '08xxxxxxxxxx',
          address: handlingUnit.sender?.address || 'IDC, Jakarta'
        },
        items: items.map(i => ({
          orderItemId: i.orderItemId,
          name: i.name,
          sku: i.skuId || i.sku,
          qty: i.qty
        }))
      };
      
      // Render appropriate label based on client
      if (clientId === 'Tokopedia') {
        renderTokopediaLabel(doc, labelData, index + 1, totalPages);
      } else {
        // Render unified best-practice label for all other clients
        renderBestPracticeLabel(doc, labelData, index + 1, totalPages);
      }
    });
    
    // Generate filename
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').replace('T', '-').split('.')[0];
    const filename = `${clientId}-${orderId}-${handlingUnit.hu}-${timestamp}.pdf`;
    
    // Auto download
    doc.save(filename);
    
    // Best-effort auto-print
    try {
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        setTimeout(() => {
          try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          } catch (e) {
            console.log('Auto-print blocked:', e);
          }
          
          // Cleanup after 1 second
          setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(blobUrl);
          }, 1000);
        }, 100);
      };
    } catch (e) {
      console.log('Print attempt failed:', e);
    }
    
    return { success: true, filename, pageCount: totalPages };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message };
  }
};
