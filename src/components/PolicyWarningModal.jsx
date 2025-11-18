import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

const PolicyWarningModal = ({ isOpen, onClose, onConfirm, warnings }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <DialogTitle className="text-gray-900 text-xl">Konfirmasi kebijakan klien</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            Beberapa box tidak sesuai kebijakan klien. Lanjutkan?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 my-4">
          {warnings.map((warning, idx) => (
            <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-900 font-medium">{warning.boxType}</p>
              <p className="text-xs text-amber-800 mt-1">{warning.message}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-300 text-gray-700"
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            Lanjutkan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyWarningModal;
