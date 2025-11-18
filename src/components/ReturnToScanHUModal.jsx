import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

const ReturnToScanHUModal = ({ onConfirm, onCancel }) => {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <DialogTitle className="text-gray-900">Kembali ke Scan Handling Unit?</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-700">
            Progress untuk HU ini akan dihapus (scan item, verifikasi IMEI, pemilihan/scan box, dll). 
            Workstation & Packer ID tetap tersimpan.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Ya, Kembali
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnToScanHUModal;
