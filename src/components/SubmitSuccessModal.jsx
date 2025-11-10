import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle2, Package, Printer, Download, X } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const SubmitSuccessModal = ({ data, onClose, onNewOrder }) => {
  const handlePrintLabel = () => {
    toast({
      title: 'Print Label',
      description: 'Fitur print label akan segera tersedia'
    });
  };

  const handleDownloadManifest = () => {
    toast({
      title: 'Download Manifest',
      description: 'Manifest akan diunduh dalam format PDF'
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-gray-900 text-2xl">Paket Berhasil Diproses!</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Order telah dikemas dan siap untuk pengiriman</p>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Order</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Handling Unit</p>
                <p className="text-sm font-medium text-gray-900">{data.hu}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Sales Order</p>
                <p className="text-sm font-medium text-gray-900">{data.salesOrder}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Package ID</p>
                <p className="text-sm font-medium text-gray-900">{data.packageId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Client</p>
                <p className="text-sm font-medium text-gray-900">{data.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Jumlah Item</p>
                <p className="text-sm font-medium text-gray-900">{data.itemCount} item</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Box Digunakan</p>
                <p className="text-sm font-medium text-gray-900">{data.boxes.length} box</p>
              </div>
            </div>
            
            {/* Boxes Used */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">Box yang Digunakan:</p>
              <div className="space-y-2">
                {data.boxes.map((box, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{box.name}</p>
                      <p className="text-xs text-gray-600">Dimensi: {box.innerDim} • Barcode: {box.barcode || 'N/A'}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900">Item yang Dikemas</p>
            </div>
            <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {data.items.map((item) => (
                <div key={item.orderItemId} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">SKU: {item.sku}</p>
                      {item.imei?.verified && (
                        <p className="text-xs text-green-600">IMEI Terverifikasi ({item.imei.values.length})</p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Qty: {item.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handlePrintLabel}
              className="w-full bg-[#1A73E8] hover:bg-[#1669C1] text-white font-medium py-6 text-base"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Label Pengiriman
            </Button>
            
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadManifest}
                className="border-gray-300 text-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Manifest
              </Button>
              <Button
                onClick={onNewOrder}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Package className="w-4 h-4 mr-2" />
                Order Baru
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 text-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                Tutup
              </Button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Langkah selanjutnya:</span> Tempelkan label pengiriman pada paket, 
              kemudian letakkan di area staging sesuai dengan logistik pengiriman.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitSuccessModal;
