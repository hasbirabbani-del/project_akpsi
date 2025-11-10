import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardContent } from './ui/card';
import { Package, Lock, User } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { MOCK_USERS } from '../data/mockData';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Username dan password harus diisi',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const user = MOCK_USERS.find(
        u => u.username === username && u.password === password
      );
      
      if (user) {
        login(user.username);
        toast({
          title: 'Login Berhasil',
          description: `Selamat datang, ${user.name}`,
        });
        navigate('/sales-order');
      } else {
        toast({
          title: 'Login Gagal',
          description: 'Username atau password salah',
          variant: 'destructive'
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="bg-[#1A73E8] p-3 rounded-xl">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">QC & Packing Sidecar</h1>
          <p className="text-sm text-gray-600">Warehouse Management System</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-gray-900"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#1A73E8] hover:bg-[#1669C1] text-white font-medium py-6 text-base transition-all"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">Demo Credentials:</p>
            <p className="text-xs text-blue-700">Username: <span className="font-mono">packer01</span></p>
            <p className="text-xs text-blue-700">Password: <span className="font-mono">demo123</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
