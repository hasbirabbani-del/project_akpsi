import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, Monitor } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const RegisterWorkstationModal = ({ onSuccess, onCancel }) => {
  const { registerWorkstation } = useApp();
  const [packerId, setPackerId] = useState('');
  const [workstationId, setWorkstationId] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = packerId.trim() || workstationId.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;

    setLoading(true);
    setTimeout(() => {
      const result = registerWorkstation(
        packerId.trim() || null,
        workstationId.trim() || null
      );
      if (result.success) {
        toast({
          title: 'Berhasil',
          description: 'Workstation berhasil didaftarkan'
        });
        onSuccess();
      } else {
        toast({
          title: 'Gagal',
          description: result.message,
          variant: 'destructive'
        });
      }
      setLoading(false);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && canSubmit) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel && onCancel()}>
      <DialogContent className="bg-white max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl">Daftarkan workstation</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Anda dapat memasukkan Packer ID atau Workstation ID untuk memulai sesi packing.
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="packerId" className="text-gray-700 font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Packer ID
            </Label>
            <Input
              id="packerId"
              type="text"
              placeholder="PKR-XXXX"
              value={packerId}
              onChange={(e) => setPackerId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white border-gray-300 text-gray-900"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workstationId" className="text-gray-700 font-medium flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Workstation ID
            </Label>
            <Input
              id="workstationId"
              type="text"
              placeholder="WS-XX"
              value={workstationId}
              onChange={(e) => setWorkstationId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-900 font-medium mb-1">Catatan:</p>
            <p className="text-xs text-amber-800">Minimal satu field harus diisi untuk melanjutkan.</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900 font-medium mb-1">Demo Credentials:</p>
            <p className="text-xs text-blue-700">Packer ID: <span className="font-mono">PKR-0821</span> atau <span className="font-mono">PKR-0822</span></p>
            <p className="text-xs text-blue-700">Workstation ID: <span className="font-mono">WS-07</span> atau <span className="font-mono">WS-08</span></p>
          </div>
        </div>
        
        <DialogFooter>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Batal
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="bg-[#1A73E8] hover:bg-[#1669C1]"
          >
            {loading ? 'Memproses...' : 'Daftarkan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterWorkstationModal;
