import React, { useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid } from 'recharts';

export const PairAnalysis = ({ data, pairs }) => {
  // We want to visualize the top pairs
  // A Scatter chart can act as a simple bubble heatmap
  const chartData = useMemo(() => {
    // Take top 50 pairs for visualization to avoid crowding
    const topPairs = pairs.slice(0, 50);
    
    return topPairs.map(p => {
      const [num1, num2] = p.pair.split('-');
      return {
        x: parseInt(num1),
        y: parseInt(num2),
        z: p.count,
        pair: p.pair,
        freq: p.freq
      };
    });
  }, [pairs]);

  return (
    <div className="animate-fade-in">
      <h1 className="gradient-text mb-8">Phân Tích Cặp Số Thường Về (Pairs)</h1>

      <div className="card mb-8">
        <h3 className="mb-4">Bản đồ Bubble (Top 50 Cặp Số)</h3>
        <p className="text-muted text-sm mb-4">Các bóng càng lớn chứng tỏ tần suất cặp số đó xuất hiện cùng nhau càng nhiều.</p>
        <div style={{ height: '400px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" dataKey="x" name="Số thứ nhất" domain={[0, 9]} stroke="#94a3b8" />
              <YAxis type="number" dataKey="y" name="Số thứ hai" domain={[0, 9]} stroke="#94a3b8" />
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="Số lần về cùng" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                contentStyle={{ backgroundColor: '#1a1d2d', borderColor: 'rgba(255,255,255,0.1)' }}
                formatter={(value, name, props) => {
                  if (name === 'Số lần về cùng') return [value, name];
                  return [value, name];
                }}
              />
              <Scatter name="Pairs" data={chartData} fill="#ff0055" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card table-container">
        <h3 className="mb-4">Bảng Xếp Hạng 20 Cặp Số Hot Nhất</h3>
        <table>
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Cặp Số</th>
              <th>Số Lần Xuất Hiện (Tổng)</th>
              <th>Tỉ Lệ Xuất Hiện</th>
            </tr>
          </thead>
          <tbody>
            {pairs.slice(0, 20).map((p, idx) => {
              const [num1, num2] = p.pair.split('-');
              return (
                <tr key={p.pair}>
                  <td>
                    <span className="badge badge-warning">#{idx + 1}</span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <span className="loto-ball">{num1}</span>
                      <span className="loto-ball">{num2}</span>
                    </div>
                  </td>
                  <td className="font-bold text-[var(--accent-primary)]">{p.count} lần</td>
                  <td>{p.freq}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
