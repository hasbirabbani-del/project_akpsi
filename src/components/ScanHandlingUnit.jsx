import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardContent } from './ui/card';
import { ScanLine, AlertCircle, Package } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const ScanHandlingUnit = () => {
  const { scanHandlingUnit, packerSession } = useApp();
  const [huCode, setHuCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = () => {
    if (!huCode.trim()) {
      setError('Nomor handling unit harus diisi');
      return;
    }

    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      const result = scanHandlingUnit(huCode.trim());
      if (result.success) {
        toast({
          title: 'Berhasil',
          description: `Handling unit ${result.data.hu} berhasil diklaim`
        });
        // No need to call onSuccess - state change will trigger re-render
      } else {
        setError(result.message);
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
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Quality control / Sales order</p>
              <h1 className="text-2xl font-bold text-gray-900">Sales order</h1>
            </div>
            {packerSession && (
              <div className="text-right">
                <p className="text-sm text-[#1A73E8] font-medium">Packing workstation {packerSession.workstation}</p>
              </div>
            )}
          </div>
        </div>

        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-3">
              <div className="bg-blue-100 p-4 rounded-full">
                <Package className="w-10 h-10 text-[#1A73E8]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan handling unit dulu, ya</h2>
            <p className="text-sm text-gray-600">
              Jika tidak bisa scan, silakan masukkan nomor handling unit pada kolom isian di bawah ini.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="huCode" className="text-gray-700 font-medium">Nomor handling unit</Label>
              <Input
                id="huCode"
                type="text"
                placeholder="HU-XXXXXXXXXX"
                value={huCode}
                onChange={(e) => {
                  setHuCode(e.target.value);
                  setError(null);
                }}
                onKeyPress={handleKeyPress}
                className="text-lg py-6 bg-white border-gray-300 text-gray-900"
                autoFocus
              />
            </div>
            
            <Button
              onClick={handleScan}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6 text-base"
              disabled={loading}
            >
              <ScanLine className="w-5 h-5 mr-2" />
              {loading ? 'Memverifikasi...' : 'Scan Handling Unit'}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              <p>Demo HU: <span className="font-mono font-medium text-gray-700">HU-9911223344</span> atau <span className="font-mono font-medium text-gray-700">HU-8822114455</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanHandlingUnit;
