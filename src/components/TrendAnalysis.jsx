import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const TrendAnalysis = ({ data, stats }) => {
  const [period, setPeriod] = useState(100); // 10, 30, 50, 100
  const [filter, setFilter] = useState('HOT'); // HOT, COLD

  // Prepare chart data
  const chartData = useMemo(() => {
    // Sort stats by frequency
    const sortedStats = [...stats].sort((a, b) => b.count - a.count);
    
    // Select top 10 or bottom 10 based on filter
    const selectedStats = filter === 'HOT' ? sortedStats.slice(0, 10) : sortedStats.slice(-10);
    
    return selectedStats.map(s => ({
      name: s.number,
      'Số lần xuất hiện': filter === 'HOT' ? s.recentCount100 : s.count,
      'Chu kỳ hiện tại': s.currentGap,
      'Chu kỳ trung bình': parseFloat(s.avgGap)
    }));
  }, [stats, filter, period]);

  // Rolling frequency for top number
  const topNumber = chartData[0]?.name || '00';
  const rollingData = useMemo(() => {
    // Calculate rolling frequency of the top number over the last N draws
    const chunks = [];
    const chunkSize = 10;
    const limit = Math.min(data.length, period);
    
    for (let i = 0; i < limit; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      let count = 0;
      chunk.forEach(d => {
        if (d.Result.includes(topNumber)) {
          count++;
        }
      });
      chunks.push({
        kỳ: `K-${i}-${i+chunkSize}`,
        'Tần suất': count
      });
    }
    return chunks.reverse(); // chronological
  }, [data, topNumber, period]);

  return (
    <div className="animate-fade-in">
      <h1 className="gradient-text mb-8">Phân Tích Xu Hướng (Trend)</h1>
      
      <div className="flex gap-4 mb-8">
        <div className="card flex-1">
          <h3 className="mb-4">Bộ Lọc Phân Tích</h3>
          <div className="flex gap-2">
            <button 
              className={`badge ${filter === 'HOT' ? 'badge-danger border border-red-500' : 'badge-info opacity-50'}`}
              onClick={() => setFilter('HOT')}
            >
              TOP SỐ NÓNG
            </button>
            <button 
              className={`badge ${filter === 'COLD' ? 'badge-info border border-blue-500' : 'badge-info opacity-50'}`}
              onClick={() => setFilter('COLD')}
            >
              TOP SỐ LẠNH
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            {[10, 30, 50, 100].map(p => (
              <button 
                key={p}
                className={`badge ${period === p ? 'badge-success' : 'badge-info opacity-50'}`}
                onClick={() => setPeriod(p)}
              >
                {p} KỲ
              </button>
            ))}
          </div>
        </div>
        
        <div className="card flex-2" style={{ flex: 2 }}>
          <h3 className="mb-4">Tần suất {filter === 'HOT' ? 'cao nhất' : 'thấp nhất'} (Tổng quan)</h3>
          <div style={{ height: '200px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1d2d', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Bar dataKey="Số lần xuất hiện" fill={filter === 'HOT' ? '#ef4444' : '#3b82f6'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4">Biểu đồ Trend của số {topNumber} (Trong {period} kỳ gần nhất)</h3>
        <p className="text-muted text-sm mb-4">Hiển thị biến động tần suất xuất hiện mỗi cụm 10 kỳ</p>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rollingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="kỳ" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1d2d', borderColor: 'rgba(255,255,255,0.1)' }} />
              <Line type="monotone" dataKey="Tần suất" stroke="#00f0ff" strokeWidth={3} dot={{ r: 4, fill: '#00f0ff' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
