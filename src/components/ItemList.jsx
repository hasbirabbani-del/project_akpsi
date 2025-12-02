import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardContent } from './ui/card';
import { CheckCircle2, XCircle, Circle, ScanLine, Shield, BookOpen, ArrowLeft, AlertTriangle } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import IMEIVerification from './IMEIVerification';
import BoxRecommendations from './BoxRecommendations';
import ReturnToScanHUModal from './ReturnToScanHUModal';
import PolicyWarningModal from './PolicyWarningModal';
import OrderReviewModal from './OrderReviewModal';

const ItemList = () => {
  const { currentHU, scanItem, isSubmitEnabled, submitPackage, startNewOrder, returnToScanHU, activeScanItemId, setActiveScanItem } = useApp();
  const [scanCode, setScanCode] = useState('');
  const [collapsedSOP, setCollapsedSOP] = useState({});
  const [imeiItem, setImeiItem] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [scanError, setScanError] = useState('');
  const [policyWarnings, setPolicyWarnings] = useState(null);

  // Keyboard shortcut: Alt+H
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        setShowReturnModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-scan on input with debounce
  useEffect(() => {
    if (!activeScanItemId || !scanCode.trim()) {
      setScanError('');
      return;
    }

    const timer = setTimeout(() => {
      handleAutoScan();
    }, 300);

    return () => clearTimeout(timer);
  }, [scanCode, activeScanItemId]);

  if (!currentHU) return null;

  const toggleSOP = (itemId) => {
    setCollapsedSOP(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleStartScan = (item) => {
    setActiveScanItem(item.orderItemId);
    setScanCode('');
    setScanError('');
  };

  const handleCancelScan = () => {
    setActiveScanItem(null);
    setScanCode('');
    setScanError('');
  };

  const handleAutoScan = () => {
    if (!scanCode.trim()) return;

    const item = currentHU.items.find(i => i.orderItemId === activeScanItemId);
    if (!item) return;

    const result = scanItem(activeScanItemId, scanCode.trim());
    if (result.success) {
      toast({
        title: 'Scan Produk Berhasil',
        description: result.message
      });
      setScanCode('');
      setScanError('');
      setActiveScanItem(null);
    } else {
      setScanError(result.message);
      toast({
        title: 'Scan Gagal',
        description: result.message,
        variant: 'destructive'
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && scanCode.trim()) {
      e.preventDefault();
      handleAutoScan();
    }
  };

  const handleIMEIOpen = (item) => {
    setImeiItem(item);
  };

  const handleIMEIClose = () => {
    setImeiItem(null);
  };

  const scannedCount = currentHU.items.filter(i => i.scanStatus === 'success').length;
  const imeiCount = currentHU.items.filter(i => i.requiresImei && i.imei?.verified).length;
  const imeiTotal = currentHU.items.filter(i => i.requiresImei).length;

  const handleSubmit = () => {
    const result = submitPackage();
    if (result.success) {
      // Check for policy violations
      if (result.violations && result.violations.length > 0) {
        setPolicyWarnings(result.violations);
      } else {
        // Open Order Review Modal
        setReviewData(result.data);
        setShowReviewModal(true);
      }
    } else {
      toast({
        title: 'Submit Gagal',
        description: result.message,
        variant: 'destructive'
      });
    }
  };

  const handleConfirmWithWarnings = () => {
    const result = submitPackage();
    setPolicyWarnings(null);
    // Open Order Review Modal
    setReviewData(result.data);
    setShowReviewModal(true);
  };

  const handleOrderBaru = () => {
    setShowReviewModal(false);
    setReviewData(null);
    returnToScanHU();
  };

  const handleReturnToScanHU = () => {
    returnToScanHU();
    setShowReturnModal(false);
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
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReturnModal(true)}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Scan HU
                </Button>
              </div>
            </div>
          </div>

          {/* Order Info - Updated Header */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Diklaim oleh:</p>
                  <p className="text-sm font-medium text-gray-900">{currentHU.pickedBy}</p>
                </div>
                {/* Client - Emphasized with badge */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-bold">Client:</p>
                  <Badge className="bg-gray-100 text-gray-900 font-semibold text-sm px-3 py-1 border border-gray-300">
                    {currentHU.clientName}
                  </Badge>
                </div>
                {/* Total Qty - Emphasized */}
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-bold">Total Qty:</p>
                  <p className="text-2xl font-semibold text-gray-900">{currentHU.totalQty}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Package ID:</p>
                  <p className="font-medium text-[#1A73E8]">{currentHU.packageId}</p>
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
          </div>

          {/* Generic Policy Fallback Banner */}
          {currentHU.clientId && !['Tokopedia', 'Shopee', 'Blibli', 'Generic'].includes(currentHU.clientId) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Kebijakan klien tidak dikenal</p>
                <p className="text-xs text-blue-800 mt-1">Menggunakan kebijakan Generic untuk HU ini.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            {/* Items List */}
            <div className="col-span-2 space-y-4">
              {currentHU.items.map((item) => (
                <Card key={item.orderItemId} className="bg-white border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      {/* Product Thumbnail */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || '/assets/products/placeholder.png'}
                          alt={`Foto produk ${item.name}`}
                          className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                          onError={(e) => {
                            e.target.src = '/assets/products/placeholder.png';
                          }}
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Order item ID: {item.orderItemId}</p>
                        <p className="font-semibold text-gray-900 text-base mb-1">{item.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <span>UPC/EAN: {item.upc}</span>
                          <span>•</span>
                          <span>SKU ID: {item.skuId}</span>
                          {item.scanStatus === 'success' && (
                            <>
                              <span>•</span>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">Qty: {item.qty}</Badge>
                          {item.boxHint && (
                            <Badge variant="outline" className="text-xs text-gray-700">{item.boxHint}</Badge>
                          )}
                          {item.requiresImei && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              IMEI: {item.imeiSlots} slot
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* SOP Section - Always expanded */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-900 mb-2">Standard Operating Procedure:</p>
                          <ul className="space-y-1">
                            {item.sop.map((step, idx) => (
                              <li key={idx} className="text-xs text-blue-800 flex items-start">
                                <span className="mr-2 font-semibold">{idx + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Compact Layout */}
                    <div className="flex items-center gap-2">
                      {/* Scan Produk - Compact */}
                      {item.scanStatus !== 'success' && activeScanItemId !== item.orderItemId && (
                        <Button
                          onClick={() => handleStartScan(item)}
                          size="sm"
                          className="h-9 px-3 text-sm bg-[#1A73E8] hover:bg-[#1669C1] text-white"
                          disabled={activeScanItemId !== null && activeScanItemId !== item.orderItemId}
                        >
                          <ScanLine className="w-4 h-4 mr-2" />
                          Scan Produk
                        </Button>
                      )}

                      {/* IMEI Verification - Always visible for IMEI items */}
                      {item.requiresImei && (
                        <Button
                          onClick={() => handleIMEIOpen(item)}
                          size="sm"
                          variant="outline"
                          className="h-9 px-3 text-sm border-amber-600 text-amber-800 hover:bg-amber-50"
                          disabled={item.imei?.verified}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Verifikasi IMEI ({item.imei?.values?.length || 0}/{item.imeiSlots})
                        </Button>
                      )}
                    </div>

                    {/* Scan Panel */}
                    {activeScanItemId === item.orderItemId && (
                      <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 space-y-2">
                        <p className="text-xs font-medium text-gray-700">Scan atau ketik UPC/SKU</p>
                        <input
                          type="text"
                          value={scanCode}
                          onChange={(e) => setScanCode(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Scan atau ketik UPC/SKU"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus
                        />
                        {scanError && (
                          <p className="text-xs text-red-600">{scanError}</p>
                        )}
                        <Button
                          onClick={handleCancelScan}
                          variant="outline"
                          size="sm"
                          className="w-full text-gray-700 border-gray-300"
                        >
                          Batal
                        </Button>
                      </div>
                    )}

                    {item.imei?.verified && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                        <p className="text-xs text-green-800 font-medium flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          IMEI terverifikasi
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary & Box Recommendations */}
            <div className="space-y-4">
              {/* Progress Summary */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Progress Scan</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Item Terscan:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {scannedCount} / {currentHU.items.length}
                    </span>
                  </div>
                  {imeiTotal > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">IMEI Terverifikasi:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {imeiCount} / {imeiTotal}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <Button
                      onClick={handleSubmit}
                      disabled={!isSubmitEnabled()}
                      className="w-full bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      Submit Packing
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Box Recommendations */}
              <BoxRecommendations enabled={scannedCount === currentHU.items.length} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {imeiItem && (
        <IMEIVerification
          item={imeiItem}
          onClose={handleIMEIClose}
        />
      )}

      {showReviewModal && reviewData && (
        <OrderReviewModal
          isOpen={showReviewModal}
          orderData={reviewData}
          currentHU={currentHU}
          session={{ clientId: currentHU.clientId }}
          onOrderBaru={handleOrderBaru}
        />
      )}

      {showReturnModal && (
        <ReturnToScanHUModal
          onConfirm={handleReturnToScanHU}
          onCancel={() => setShowReturnModal(false)}
        />
      )}

      {policyWarnings && (
        <PolicyWarningModal
          isOpen={true}
          onClose={() => setPolicyWarnings(null)}
          onConfirm={handleConfirmWithWarnings}
          warnings={policyWarnings}
        />
      )}
    </>
  );
};

export default ItemList;
