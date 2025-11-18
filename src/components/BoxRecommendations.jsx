import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Box, CheckCircle2, AlertTriangle, MapPin, BookOpen, Package, ScanLine, Plus } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import VisualGuideModal from './VisualGuideModal';

const BoxRecommendations = ({ enabled }) => {
  const { currentHU, toggleManualMode, selectBox, scanBox, addManualBox, session, clientPolicies } = useApp();
  const [guideBox, setGuideBox] = useState(null);
  const [scanningBoxId, setScanningBoxId] = useState(null);
  const [boxBarcode, setBoxBarcode] = useState('');
  const [addingManualBox, setAddingManualBox] = useState(false);
  const [manualBoxBarcode, setManualBoxBarcode] = useState('');

  // Auto-scan box barcode with debounce
  React.useEffect(() => {
    if (!scanningBoxId || !boxBarcode.trim()) return;

    const timer = setTimeout(() => {
      handleAutoScanBox(scanningBoxId);
    }, 300);

    return () => clearTimeout(timer);
  }, [boxBarcode, scanningBoxId]);

  if (!currentHU || !currentHU.recommendations) return null;

  const { mode, boxes } = currentHU.recommendations;
  const selectedBoxes = boxes.filter(box => box.status === 'selected');
  const clientId = session.clientId || 'Generic';
  const policy = clientPolicies[clientId];

  // Check if box type is allowed by client policy
  const isBoxAllowed = (boxType) => {
    if (!policy) return true;
    return policy.allowedBoxTypes.includes(boxType);
  };

  const handleSelectBox = (boxId) => {
    if (!enabled && mode === 'auto') return;
    
    const result = selectBox(boxId);
    if (result.success) {
      toast({
        title: 'Box Dipilih',
        description: 'Box berhasil dipilih untuk pengepakan'
      });
    }
  };

  const handleToggleManual = () => {
    const result = toggleManualMode();
    if (result.success) {
      toast({
        title: result.mode === 'manual' ? 'Mode Manual Aktif' : 'Mode Auto Aktif',
        description: result.message
      });
    }
  };

  const handleScanBox = (boxId) => {
    if (!boxBarcode.trim()) {
      toast({
        title: 'Error',
        description: 'Barcode box tidak boleh kosong',
        variant: 'destructive'
      });
      return;
    }

    const result = scanBox(boxId, boxBarcode.trim());
    if (result.success) {
      toast({
        title: 'Box Terscan',
        description: `Box berhasil discan: ${boxBarcode}`
      });
      setScanningBoxId(null);
      setBoxBarcode('');
    }
  };

  const handleAutoScanBox = (boxId) => {
    if (!boxBarcode.trim()) return;
    
    const result = scanBox(boxId, boxBarcode.trim());
    if (result.success) {
      toast({
        title: 'Box Auto-Scan',
        description: `Box berhasil discan otomatis: ${boxBarcode}`
      });
      setScanningBoxId(null);
      setBoxBarcode('');
    }
  };

  const handleAddManualBox = () => {
    if (!manualBoxBarcode.trim()) {
      toast({
        title: 'Error',
        description: 'Barcode box tidak boleh kosong',
        variant: 'destructive'
      });
      return;
    }

    const result = addManualBox(manualBoxBarcode.trim());
    if (result.success) {
      toast({
        title: 'Box Ditambahkan',
        description: 'Box manual berhasil ditambahkan'
      });
      setAddingManualBox(false);
      setManualBoxBarcode('');
    }
  };

  return (
    <>
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Box className="w-4 h-4" />
              Rekomendasi Box
            </h3>
            {!enabled && (
              <Badge variant="outline" className="text-gray-500 border-gray-300">
                Terkunci
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {!enabled && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900">
                Scan dan verifikasi semua item terlebih dahulu
              </p>
            </div>
          )}

          {enabled && (
            <>
              {/* Mode Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${mode === 'auto' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {mode === 'auto' ? 'Mode Auto' : 'Mode Manual'}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleManual}
                  className="text-xs"
                >
                  {mode === 'auto' ? 'Gunakan Manual' : 'Gunakan Auto'}
                </Button>
              </div>

              {/* Manual Mode Banner */}
              {mode === 'manual' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900 font-medium">
                    Mode manual—pastikan penempatan sesuai SOP
                  </p>
                </div>
              )}

              {/* Add Manual Box Button */}
              {mode === 'manual' && (
                <div className="space-y-2">
                  {!addingManualBox ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAddingManualBox(true)}
                      className="w-full text-[#1A73E8] border-[#1A73E8] hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Scan Box Baru
                    </Button>
                  ) : (
                    <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs font-medium text-blue-900">Scan box baru:</p>
                      <input
                        type="text"
                        placeholder="Scan atau ketik barcode box"
                        value={manualBoxBarcode}
                        onChange={(e) => setManualBoxBarcode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddManualBox()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAddManualBox} className="flex-1 bg-[#1A73E8] hover:bg-[#1669C1]">
                          Tambah
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setAddingManualBox(false);
                          setManualBoxBarcode('');
                        }}>
                          Batal
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Box List with OrderGroups */}
              <div className="space-y-3">
                {boxes.length === 0 && mode === 'manual' && (
                  <div className="text-center py-4 text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Belum ada box. Scan box untuk memulai.</p>
                  </div>
                )}

                {boxes.map((box) => {
                  const boxType = box.boxType || box.name;
                  const allowed = isBoxAllowed(boxType);
                  const showWarning = mode === 'manual' && !allowed && box.status === 'selected';

                  return (
                    <div
                      key={box.boxId}
                      className={`border rounded-lg p-4 transition-all ${
                        box.status === 'selected'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                      }`}
                      onClick={() => mode === 'manual' && handleSelectBox(box.boxId)}
                    >
                      <div className="space-y-3">
                        {/* Box Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-semibold text-gray-900">{boxType}</h4>
                              {box.status === 'selected' && mode === 'auto' && (
                                <Badge className="bg-green-600 text-white text-xs">
                                  Dipilih (Auto)
                                </Badge>
                              )}
                              {box.status === 'available' && mode === 'auto' && (
                                <Badge variant="outline" className="text-gray-700 border-gray-400 text-xs">
                                  Alternatif (Auto)
                                </Badge>
                              )}
                              {box.status === 'selected' && mode === 'manual' && (
                                <Badge className="bg-green-600 text-white text-xs">
                                  Dipilih
                                </Badge>
                              )}
                              {box.scanned && (
                                <Badge className="bg-blue-600 text-white text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Terscan
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">Dimensi: {box.innerDim} • Kapasitas: {box.capacityL}L</p>
                          </div>
                        </div>

                        {/* Policy Warning (Manual Mode) */}
                        {showWarning && (
                          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-yellow-900 font-semibold">Peringatan Kebijakan</p>
                              <p className="text-xs text-yellow-800 mt-1">
                                Box ini tidak termasuk dalam daftar box yang diizinkan untuk klien {clientId}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700 font-medium">{box.location}</span>
                        </div>

                        {/* OrderGroups */}
                        {box.orderGroups && box.orderGroups.length > 0 && (
                          <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                            {box.orderGroups.map((orderGroup, ogIdx) => (
                              <div key={ogIdx} className="bg-gray-50 rounded-lg p-3 space-y-2">
                                {/* Order IDs */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-semibold text-gray-700">Order:</span>
                                  {orderGroup.orderIds.map((orderId, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {orderId}
                                    </Badge>
                                  ))}
                                </div>

                                {/* Items in this orderGroup */}
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-gray-700">Items:</p>
                                  {orderGroup.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex items-center justify-between text-xs text-gray-600">
                                      <span>{item.name || item.sku}</span>
                                      <span className="font-medium">Qty: {item.qty}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* SOP Tags */}
                                {orderGroup.sopTags && orderGroup.sopTags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {orderGroup.sopTags.map((tag, tagIdx) => (
                                      <span key={tagIdx} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Visual Guide Button (Auto Mode Only) */}
                                {mode === 'auto' && orderGroup.visualGuide && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setGuideBox({ ...box, visualGuide: orderGroup.visualGuide });
                                    }}
                                    className="w-full text-[#1A73E8] border-[#1A73E8] hover:bg-blue-50 mt-2"
                                  >
                                    <BookOpen className="w-3 h-3 mr-2" />
                                    Panduan Visual
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Scan Box Action */}
                        {box.status === 'selected' && !box.scanned && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            {scanningBoxId === box.boxId ? (
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-700">Scan atau ketik barcode box</p>
                                <input
                                  type="text"
                                  placeholder="Scan atau ketik barcode box"
                                  value={boxBarcode}
                                  onChange={(e) => setBoxBarcode(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleAutoScanBox(box.boxId)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                  autoFocus
                                />
                                <Button size="sm" variant="outline" onClick={() => {
                                  setScanningBoxId(null);
                                  setBoxBarcode('');
                                }} className="w-full">
                                  Batal
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Close any other open box scan panel
                                  setScanningBoxId(box.boxId);
                                  setBoxBarcode('');
                                }}
                                className="w-full bg-[#1A73E8] hover:bg-[#1669C1] text-white"
                              >
                                <ScanLine className="w-4 h-4 mr-2" />
                                Scan Box
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Visual Guide Modal */}
      {guideBox && (
        <VisualGuideModal
          box={guideBox}
          onClose={() => setGuideBox(null)}
        />
      )}
    </>
  );
};

export default BoxRecommendations;
