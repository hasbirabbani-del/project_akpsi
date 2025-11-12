import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Monitor, ScanLine } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { MOCK_WORKSTATIONS } from '../data/mockData';

const RegisterWorkstationModal = ({ onSuccess, onCancel }) => {
  const { registerWorkstation } = useApp();
  const [packerId, setPackerId] = useState('');
  const [workstationId, setWorkstationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanningWorkstation, setScanningWorkstation] = useState(false);
  const [workstationScanInput, setWorkstationScanInput] = useState('');
  const [showWorkstationHint, setShowWorkstationHint] = useState(false);
  const [showPackerHint, setShowPackerHint] = useState(false);

  const canSubmit = packerId.trim() && workstationId.trim();

  const handleSubmit = () => {
    // Show hints if fields are missing
    if (!workstationId.trim()) {
      setShowWorkstationHint(true);
      return;
    }
    if (!packerId.trim()) {
      setShowPackerHint(true);
      return;
    }

    if (!canSubmit) return;

    setLoading(true);
    setTimeout(() => {
      const result = registerWorkstation(
        packerId.trim(),
        workstationId.trim()
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

  const handleWorkstationScan = () => {
    if (workstationScanInput.trim()) {
      const ws = MOCK_WORKSTATIONS.find(w => w.workstationId === workstationScanInput.trim());
      if (ws) {
        setWorkstationId(ws.workstationId);
        setScanningWorkstation(false);
        setWorkstationScanInput('');
        setShowWorkstationHint(false);
        toast({
          title: 'Workstation Terscan',
          description: `${ws.workstationId} berhasil dipilih`
        });
      } else {
        toast({
          title: 'Tidak Ditemukan',
          description: 'Workstation ID tidak valid',
          variant: 'destructive'
        });
      }
    }
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
            Pilih workstation kemudian masukkan Packer ID untuk memulai sesi packing. Keduanya dapat di-scan.
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Workstation Selector */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Workstation
            </Label>
            
            {!scanningWorkstation ? (
              <div className="flex gap-2">
                <Select value={workstationId} onValueChange={(value) => {
                  setWorkstationId(value);
                  setShowWorkstationHint(false);
                }}>
                  <SelectTrigger className="flex-1 bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Pilih workstation atau scan Workstation ID" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {MOCK_WORKSTATIONS.map((ws) => (
                      <SelectItem key={ws.workstationId} value={ws.workstationId} className="cursor-pointer">
                        {ws.workstationId} - {ws.line}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setScanningWorkstation(true)}
                  className="px-3"
                >
                  <ScanLine className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-medium text-blue-900">Scan Workstation ID:</p>
                <input
                  type="text"
                  placeholder="Scan atau ketik Workstation ID"
                  value={workstationScanInput}
                  onChange={(e) => setWorkstationScanInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleWorkstationScan()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleWorkstationScan} className="flex-1 bg-[#1A73E8] hover:bg-[#1669C1]">
                    Scan
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setScanningWorkstation(false);
                    setWorkstationScanInput('');
                  }}>
                    Batal
                  </Button>
                </div>
              </div>
            )}
            
            {showWorkstationHint && !workstationId && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                Silakan pilih workstation.
              </p>
            )}
          </div>
          
          {/* Packer ID Input */}
          <div className="space-y-2">
            <Label htmlFor="packerId" className="text-gray-700 font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Packer ID
            </Label>
            <Input
              id="packerId"
              type="text"
              placeholder="Masukkan Packer ID atau scan barcode"
              value={packerId}
              onChange={(e) => {
                setPackerId(e.target.value);
                setShowPackerHint(false);
              }}
              onKeyPress={handleKeyPress}
              className="bg-white border-gray-300 text-gray-900"
            />
            {showPackerHint && !packerId && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                Silakan masukkan Packer ID.
              </p>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900 font-medium mb-1">Demo:</p>
            <p className="text-xs text-blue-700">Packer ID: <span className="font-mono">PKR-0821</span> / <span className="font-mono">PKR-0822</span></p>
            <p className="text-xs text-blue-700">Workstation: <span className="font-mono">WS-07</span> / <span className="font-mono">WS-08</span></p>
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
