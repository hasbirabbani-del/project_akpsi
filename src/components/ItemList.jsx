import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardContent } from './ui/card';
import { CheckCircle2, XCircle, Circle, ScanLine, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import IMEIVerification from './IMEIVerification';
import BoxRecommendations from './BoxRecommendations';
import SubmitSuccessModal from './SubmitSuccessModal';

const ItemList = () => {
  const { currentHU, scanItem, isSubmitEnabled, submitPackage, startNewOrder } = useApp();
  const [scanningItem, setScanningItem] = useState(null);
  const [scanCode, setScanCode] = useState('');
  const [collapsedSOP, setCollapsedSOP] = useState({});
  const [imeiItem, setImeiItem] = useState(null);
  const [submitData, setSubmitData] = useState(null);
  const [scanOpenState, setScanOpenState] = useState({}); // Track which scan areas are open

  if (!currentHU) return null;

  const toggleSOP = (itemId) => {
    setCollapsedSOP(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleStartScan = (item) => {
    setScanningItem(item);
    setScanCode('');
    setScanOpenState(prev => ({ ...prev, [item.orderItemId]: true }));
  };

  const handleCancelScan = (item) => {
    setScanningItem(null);
    setScanCode('');
    setScanOpenState(prev => ({ ...prev, [item.orderItemId]: false }));
  };

  const handleScanSubmit = () => {
    if (!scanCode.trim()) {
      toast({
        title: 'Error',
        description: 'Kode scan tidak boleh kosong',
        variant: 'destructive'
      });
      return;
    }

    const result = scanItem(scanningItem.orderItemId, scanCode.trim());
    if (result.success) {
      toast({
        title: 'Scan Produk Berhasil',
        description: result.message
      });
      setScanningItem(null);
      setScanCode('');
      setScanOpenState(prev => ({ ...prev, [scanningItem.orderItemId]: false }));
    } else {
      toast({
        title: 'Scan Gagal',
        description: result.message,
        variant: 'destructive'
      });
    }
  };

  const handleVerifyIMEI = (item) => {
    setImeiItem(item);
  };

  const getStatusIcon = (status, imeiVerified, requiresImei) => {
    if (status === 'success' && (!requiresImei || imeiVerified)) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (status === 'failed') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const allItemsScanned = currentHU.items.every(item => {
    if (item.scanStatus !== 'success') return false;
    if (item.requiresImei && !item.imei?.verified) return false;
    return true;
  });

  const scannedCount = currentHU.items.filter(i => i.scanStatus === 'success').length;
  const imeiCount = currentHU.items.filter(i => i.requiresImei && i.imei?.verified).length;
  const imeiTotal = currentHU.items.filter(i => i.requiresImei).length;

  const handleSubmit = () => {
    const result = submitPackage();
    if (result.success) {
      setSubmitData(result.data);
    } else {
      toast({
        title: 'Submit Gagal',
        description: result.message,
        variant: 'destructive'
      });
    }
  };

  const handleCloseSubmitModal = () => {
    setSubmitData(null);
  };

  const handleNewOrder = () => {
    startNewOrder();
    setSubmitData(null);
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Quality control / Sales order / {currentHU.hu}</p>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">Handling unit {currentHU.hu}</h1>
                  <Badge className="bg-green-600 text-white">Open</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs text-gray-500 mb-1">Diklaim oleh:</p>
                <p className="text-sm font-medium text-gray-900">{currentHU.pickedBy}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Package(s):</p>
                <p className="text-sm font-medium text-gray-900">{currentHU.packageCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Qty:</p>
                <p className="text-sm font-medium text-gray-900">{currentHU.totalQty}</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Package ID:</p>
                <p className="font-medium text-[#1A73E8]">{currentHU.packageId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Client:</p>
                <p className="font-medium text-gray-900">{currentHU.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Logistik:</p>
                <p className="font-medium text-gray-900">{currentHU.logistic}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Dest. city:</p>
                <p className="font-medium text-gray-900">{currentHU.destCity}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Items List */}
            <div className="col-span-2 space-y-4">
              {currentHU.items.map((item) => (
                <Card key={item.orderItemId} className={`bg-white border-2 transition-all ${
                  scanningItem?.orderItemId === item.orderItemId ? 'border-[#1A73E8] shadow-lg' : 'border-gray-200'
                } ${item.scanStatus === 'success' && (!item.requiresImei || item.imei?.verified) ? 'border-green-200 bg-green-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(item.scanStatus, item.imei?.verified, item.requiresImei)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Order Item ID: {item.orderItemId}</p>
                            <h3 className="font-semibold text-gray-900 text-base mb-1">{item.name}</h3>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span>UPC/EAN: <span className="font-mono font-medium">{item.upc}</span></span>
                              <span>SKU ID: <span className="font-mono font-medium">{item.skuId}</span></span>
                              {item.scanStatus === 'success' && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Qty:</p>
                            <p className="text-xl font-bold text-gray-900">{item.qty}</p>
                          </div>
                        </div>

                        {/* SOP - Inline, Expanded by Default */}
                        <div className={`mb-3 transition-all ${collapsedSOP[item.orderItemId] ? 'hidden' : 'block'}`}>
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-amber-900 uppercase">Packing SOP:</p>
                              <button
                                onClick={() => toggleSOP(item.orderItemId)}
                                className="text-amber-700 hover:text-amber-900"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                            </div>
                            <ul className="space-y-1">
                              {item.sop.map((step, idx) => (
                                <li key={idx} className="text-sm text-amber-900 flex items-start gap-2">
                                  <span className="font-medium">{idx + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Collapsed SOP Button */}
                        {collapsedSOP[item.orderItemId] && (
                          <button
                            onClick={() => toggleSOP(item.orderItemId)}
                            className="mb-3 text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1"
                          >
                            <ChevronDown className="w-4 h-4" />
                            Tampilkan SOP
                          </button>
                        )}

                        {/* Scanning Interface */}
                        {scanOpenState[item.orderItemId] && scanningItem?.orderItemId === item.orderItemId && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                            <p className="text-sm font-medium text-gray-900 mb-2">Scan barcode produk</p>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Scan atau ketik UPC/SKU"
                                value={scanCode}
                                onChange={(e) => setScanCode(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleScanSubmit()}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                                autoFocus
                              />
                              <Button size="sm" onClick={handleScanSubmit} className="bg-[#1A73E8] hover:bg-[#1669C1]">
                                <ScanLine className="w-4 h-4 mr-1" />
                                Scan
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleCancelScan(item)}>
                                Batal
                              </Button>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">Demo: gunakan <span className="font-mono font-medium">{item.upc}</span> atau <span className="font-mono font-medium">{item.sku}</span></p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mb-2">
                          {/* Only show Scan Produk button when scan area is NOT open and item not yet scanned */}
                          {!scanOpenState[item.orderItemId] && item.scanStatus !== 'success' && (
                            <Button
                              size="sm"
                              onClick={() => handleStartScan(item)}
                              className="bg-[#1A73E8] hover:bg-[#1669C1]"
                            >
                              <ScanLine className="w-4 h-4 mr-1" />
                              Scan Produk
                            </Button>
                          )}
                          
                          {item.scanStatus === 'success' && (
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Terscan
                            </Badge>
                          )}
                          
                          {item.requiresImei && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerifyIMEI(item)}
                              disabled={item.scanStatus !== 'success'}
                              className={item.imei?.verified ? 'border-green-500 text-green-700' : ''}
                            >
                              <Shield className="w-4 h-4 mr-1" />
                              {item.imei?.verified ? `IMEI Terverifikasi (${item.imei.values.length})` : `Verifikasi IMEI (0/${item.imeiSlots})`}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right Sidebar - Summary & Box */}
            <div className="space-y-4">
              {/* Summary */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-gray-900">Ringkasan</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SKU:</span>
                    <span className="text-sm font-medium text-gray-900">{scannedCount} / {currentHU.items.length}</span>
                  </div>
                  {imeiTotal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">IMEI:</span>
                      <span className="text-sm font-medium text-gray-900">{imeiCount} / {imeiTotal}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Box Recommendations */}
              <BoxRecommendations enabled={allItemsScanned} />

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!isSubmitEnabled()}
                className="w-full bg-[#1A73E8] hover:bg-[#1669C1] disabled:bg-gray-400 disabled:cursor-not-allowed py-6 text-base font-medium"
              >
                Submit paket
              </Button>
              
              {!isSubmitEnabled() && (
                <p className="text-xs text-center text-gray-500">
                  {!allItemsScanned ? 'Scan dan verifikasi semua item terlebih dahulu' : 'Pilih box untuk melanjutkan'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* IMEI Verification Modal */}
      {imeiItem && (
        <IMEIVerification
          item={imeiItem}
          onClose={() => setImeiItem(null)}
        />
      )}

      {/* Submit Success Modal */}
      {submitData && (
        <SubmitSuccessModal
          data={submitData}
          onClose={handleCloseSubmitModal}
          onNewOrder={handleNewOrder}
        />
      )}
    </>
  );
};

export default ItemList;
