import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const IMEIVerification = ({ item, onClose }) => {
  const { verifyImei } = useApp();
  const [imeiValues, setImeiValues] = useState(Array(item.imeiSlots).fill(''));
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (item.imei?.values && item.imei.values.length > 0) {
      setImeiValues(item.imei.values);
    }
  }, [item]);

  const handleImeiChange = (index, value) => {
    const newValues = [...imeiValues];
    newValues[index] = value;
    setImeiValues(newValues);
    
    // Clear errors when user types
    const newErrors = [...errors];
    newErrors[index] = null;
    setErrors(newErrors);
  };

  const validateImei = (imei) => {
    if (!imei || imei.length === 0) {
      return 'IMEI tidak boleh kosong';
    }
    if (!/^\d+$/.test(imei)) {
      return 'IMEI harus berisi angka saja';
    }
    if (imei.length < 14 || imei.length > 16) {
      return 'IMEI harus 14-16 digit';
    }
    return null;
  };

  const handleVerify = () => {
    // Validate each IMEI
    const newErrors = imeiValues.map(imei => validateImei(imei));
    setErrors(newErrors);
    
    if (newErrors.some(err => err !== null)) {
      toast({
        title: 'Validasi Gagal',
        description: 'Periksa kembali input IMEI Anda',
        variant: 'destructive'
      });
      return;
    }
    
    // Check for duplicates
    const uniqueImeis = new Set(imeiValues);
    if (uniqueImeis.size !== imeiValues.length) {
      toast({
        title: 'IMEI Duplikat',
        description: 'IMEI tidak boleh sama',
        variant: 'destructive'
      });
      return;
    }
    
    const result = verifyImei(item.orderItemId, imeiValues);
    if (result.success) {
      toast({
        title: 'Verifikasi Berhasil',
        description: `${imeiValues.length} IMEI berhasil diverifikasi`,
        className: 'bg-green-600 text-white border-green-700'
      });
      onClose();
    } else {
      toast({
        title: 'Verifikasi Gagal',
        description: result.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Shield className="w-5 h-5 text-[#1A73E8]" />
            Verifikasi IMEI
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900 font-medium">{item.name}</p>
            <p className="text-xs text-blue-700 mt-1">Order Item ID: {item.orderItemId}</p>
          </div>
          
          <div className="space-y-3">
            {Array.from({ length: item.imeiSlots }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`imei-${index}`} className="text-gray-700">
                  IMEI Slot {index + 1} {item.imei?.verified && item.imei.values[index] && (
                    <CheckCircle2 className="inline w-4 h-4 text-green-500 ml-1" />
                  )}
                </Label>
                <Input
                  id={`imei-${index}`}
                  type="text"
                  placeholder="Masukkan 14-16 digit IMEI"
                  value={imeiValues[index]}
                  onChange={(e) => handleImeiChange(index, e.target.value)}
                  className={`font-mono bg-white text-gray-900 ${errors[index] ? 'border-red-500' : ''}`}
                  maxLength={16}
                  disabled={item.imei?.verified}
                />
                {errors[index] && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors[index]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-900 font-medium mb-1">Catatan Penting:</p>
            <ul className="text-xs text-amber-800 space-y-1">
              <li>• IMEI harus 14-16 digit numerik</li>
              <li>• Tidak boleh ada IMEI yang sama</li>
              <li>• Pastikan IMEI sesuai dengan stiker pada device</li>
            </ul>
          </div>
          
          {item.imei?.verified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-900 font-medium">IMEI sudah terverifikasi</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {item.imei?.verified ? 'Tutup' : 'Batal'}
          </Button>
          {!item.imei?.verified && (
            <Button onClick={handleVerify} className="bg-[#1A73E8] hover:bg-[#1669C1]">
              <Shield className="w-4 h-4 mr-2" />
              Verifikasi IMEI
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IMEIVerification;
