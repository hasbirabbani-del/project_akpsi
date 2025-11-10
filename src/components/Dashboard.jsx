import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { TrendingUp, Package, Printer, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    ordersPerHour: [2,1,0,0,0,3,5,8,12,14,16,18,17,16,12,9,8,7,5,3,2,2,1,1],
    manualBoxCount: 27,
    labelQueue: 6,
    avgPackTimeMin: 7.8,
    scanSuccessRate: 0.96
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        labelQueue: Math.max(0, prev.labelQueue + Math.floor(Math.random() * 3 - 1)),
        manualBoxCount: prev.manualBoxCount + Math.floor(Math.random() * 2),
        scanSuccessRate: Math.min(1, prev.scanSuccessRate + (Math.random() * 0.02 - 0.01))
      }));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const currentHour = new Date().getHours();
  const todayOrders = dashboardData.ordersPerHour.slice(0, currentHour + 1).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm text-gray-600">Operational KPIs - Live Updates</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Orders Today */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Order Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{todayOrders}</p>
              <p className="text-xs text-gray-500 mt-1">Total sampai jam {currentHour}:00</p>
            </CardContent>
          </Card>

          {/* Manual Box Usage */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Box Dipilih Manual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.manualBoxCount}</p>
              <p className="text-xs text-gray-500 mt-1">Hari ini</p>
            </CardContent>
          </Card>

          {/* Label Queue */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Antrian Cetak Label
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.labelQueue}</p>
              <p className="text-xs text-gray-500 mt-1">Saat ini</p>
            </CardContent>
          </Card>

          {/* Average Pack Time */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Rata-rata Waktu Packing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.avgPackTimeMin.toFixed(1)}<span className="text-lg text-gray-600">m</span></p>
              <p className="text-xs text-gray-500 mt-1">Per paket</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Per Hour Chart */}
        <Card className="bg-white border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Order/jam Hari Ini</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Grafik distribusi order per jam (0-23)</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-1">
              {dashboardData.ordersPerHour.map((count, hour) => {
                const maxOrders = Math.max(...dashboardData.ordersPerHour);
                const heightPercent = (count / maxOrders) * 100;
                const isPast = hour <= currentHour;
                
                return (
                  <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-gray-500 mb-1">{count}</div>
                    <div
                      className={`w-full rounded-t transition-all ${
                        isPast ? 'bg-[#1A73E8]' : 'bg-gray-200'
                      }`}
                      style={{ height: `${heightPercent}%`, minHeight: count > 0 ? '4px' : '2px' }}
                    />
                    <div className="text-[10px] text-gray-400 mt-1">{hour}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Scan Success Rate */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Tingkat Keberhasilan Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 transition-all duration-500"
                    style={{ width: `${dashboardData.scanSuccessRate * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(dashboardData.scanSuccessRate * 100).toFixed(1)}%
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Scan pertama berhasil tanpa error</p>
          </CardContent>
        </Card>

        {/* Live Update Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live updates setiap 12 detik</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
