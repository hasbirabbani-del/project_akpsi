import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Box, CheckCircle2, AlertTriangle, MapPin, BookOpen, Package, ScanLine, Plus } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import VisualGuideModal from './VisualGuideModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const BoxRecommendations = ({ enabled }) => {
  const { currentHU, manualMode, toggleManualMode, selectBox, scanBox, addManualBox, reassignItemToBox } = useApp();
  const [guideBox, setGuideBox] = useState(null);
  const [scanningBoxId, setScanningBoxId] = useState(null);
  const [boxBarcode, setBoxBarcode] = useState('');
  const [addingManualBox, setAddingManualBox] = useState(false);
  const [manualBoxBarcode, setManualBoxBarcode] = useState('');

  if (!currentHU || !currentHU.recommendations) return null;

  const { mode, boxes } = currentHU.recommendations;
  const selectedBoxes = boxes.filter(box => box.status === 'selected');

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
    toggleManualMode();
    toast({
      title: mode === 'auto' ? 'Mode Manual Aktif' : 'Mode Auto Aktif',
      description: mode === 'auto' ? 'Anda dapat memilih box secara manual' : 'Menggunakan rekomendasi sistem'
    });
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

  const handleItemReassign = (itemId, boxId) => {
    reassignItemToBox(itemId, boxId);
    toast({
      title: 'Item Dipindahkan',
      description: 'Item berhasil ditempatkan ke box'
    });
  };

  const getItemName = (itemId) => {
    const item = currentHU.items.find(i => i.orderItemId === itemId);
    return item ? item.name : itemId;
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

              {/* Box List */}
              <div className="space-y-3">
                {boxes.length === 0 && mode === 'manual' && (
                  <div className="text-center py-4 text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Belum ada box. Scan box untuk memulai.</p>
                  </div>
                )}

                {boxes.map((box) => (
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
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{box.name}</h4>
                            {box.status === 'selected' && (
                              <Badge className="bg-green-600 text-white text-xs">
                                {mode === 'auto' ? 'Dipilih (Auto)' : 'Dipilih'}
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

                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 font-medium">{box.location}</span>
                      </div>

                      {/* Special Handling Tags */}
                      {box.specialHandlingTags && box.specialHandlingTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {box.specialHandlingTags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Assigned Items */}
                      {box.assignedItems && box.assignedItems.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded p-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            Item yang ditempatkan:
                          </p>
                          <ul className="space-y-1">
                            {box.assignedItems.map((itemId, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                {getItemName(itemId)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Manual Mode: Item Assignment */}
                      {mode === 'manual' && box.status === 'selected' && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <p className="text-xs font-semibold text-blue-900 mb-2">Assign item ke box ini:</p>
                          <div className="space-y-2">
                            {currentHU.items.map((item) => (
                              <div key={item.orderItemId} className="flex items-center justify-between">
                                <span className="text-xs text-gray-700">{item.name}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleItemReassign(item.orderItemId, box.boxId);
                                  }}
                                  className="text-xs h-6"
                                  disabled={box.assignedItems.includes(item.orderItemId)}
                                >
                                  {box.assignedItems.includes(item.orderItemId) ? 'Sudah di box ini' : 'Tempatkan'}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Scan Box Input */}
                      {box.status === 'selected' && !box.scanned && (
                        <div className="space-y-2">
                          {scanningBoxId !== box.boxId ? (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setScanningBoxId(box.boxId);
                              }}
                              className="w-full bg-[#1A73E8] hover:bg-[#1669C1]"
                            >
                              <ScanLine className="w-4 h-4 mr-2" />
                              Scan Box
                            </Button>
                          ) : (
                            <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs font-medium text-blue-900">Scan barcode box:</p>
                              <input
                                type="text"
                                placeholder="Scan atau ketik barcode"
                                value={boxBarcode}
                                onChange={(e) => setBoxBarcode(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleScanBox(box.boxId)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleScanBox(box.boxId)} className="flex-1 bg-[#1A73E8] hover:bg-[#1669C1]">
                                  Scan
                                </Button>
                                <Button size="sm" variant="outline" onClick={(e) => {
                                  e.stopPropagation();
                                  setScanningBoxId(null);
                                  setBoxBarcode('');
                                }}>
                                  Batal
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500">Demo: gunakan barcode apa saja, misal: BOX001</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Visual Guide Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGuideBox(box);
                        }}
                        className="w-full text-[#1A73E8] border-[#1A73E8] hover:bg-blue-50"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Panduan visual
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Info */}
              {selectedBoxes.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">{selectedBoxes.length}</span> box dipilih
                    {' • '}
                    <span className="font-semibold">{selectedBoxes.filter(b => b.scanned).length}</span> terscan
                  </p>
                </div>
              )}
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
