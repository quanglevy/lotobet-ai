import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

export const NumberAnalysis = ({ data, stats }) => {
  const [searchNum, setSearchNum] = useState('5');
  
  const numberStat = useMemo(() => {
    return stats.find(s => s.number === searchNum);
  }, [searchNum, stats]);

  const history = useMemo(() => {
    if (!numberStat) return [];
    return data.filter(d => d.Result.includes(numberStat.number)).slice(0, 10);
  }, [data, numberStat]);

  return (
    <div className="animate-fade-in">
      <h1 className="gradient-text mb-8">Phân Tích Số Chi Tiết</h1>
      
      <div className="card mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
            <input 
              type="number" 
              value={searchNum}
              onChange={(e) => setSearchNum(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md text-white focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
              placeholder="Nhập số (0-9)..."
              min="0"
              max="9"
            />
          </div>
          <button className="px-4 py-2 bg-[var(--accent-primary)] text-black font-bold rounded-md hover:bg-opacity-80 transition-colors">
            Phân Tích
          </button>
        </div>
      </div>

      {numberStat ? (
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="card text-center border-t-4 border-t-[var(--accent-primary)]">
            <div className="text-muted text-sm mb-2">Số Đang Phân Tích</div>
            <div className="text-4xl font-bold text-white mb-2">
              <span className="loto-ball" style={{ width: 64, height: 64, fontSize: '2rem' }}>
                {numberStat.number}
              </span>
            </div>
            <div className="text-success font-bold mt-4">Điểm Xác Suất: {numberStat.score}</div>
          </div>
          
          <div className="card">
            <h3 className="text-lg mb-4 text-[var(--accent-secondary)]">Thống Kê Tổng Quan</h3>
            <div className="flex justify-between border-b border-[var(--border-color)] py-2">
              <span className="text-muted">Tổng lần xuất hiện</span>
              <span className="font-bold">{numberStat.count} lần</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border-color)] py-2">
              <span className="text-muted">Tỉ lệ xuất hiện</span>
              <span className="font-bold">{numberStat.frequency}%</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border-color)] py-2">
              <span className="text-muted">Xu hướng</span>
              <span className="font-bold">{numberStat.trend === 'Up' ? 'Tăng (Hot)' : numberStat.trend === 'Down' ? 'Giảm (Cold)' : 'Ổn định'}</span>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg mb-4 text-[var(--warning)]">Phân Tích Chu Kỳ (Gap)</h3>
            <div className="flex justify-between border-b border-[var(--border-color)] py-2">
              <span className="text-muted">Đang vắng (Current Gap)</span>
              <span className="font-bold text-danger">{numberStat.currentGap} kỳ</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border-color)] py-2">
              <span className="text-muted">Chu kỳ Trung Bình</span>
              <span className="font-bold">{numberStat.avgGap} kỳ</span>
            </div>
            <div className="flex justify-between border-b border-[var(--border-color)] py-2">
              <span className="text-muted">Chu kỳ Lớn Nhất (Max Gap)</span>
              <span className="font-bold">{numberStat.maxGap} kỳ</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center text-muted p-8">Vui lòng nhập một số hợp lệ từ 0 đến 9.</div>
      )}

      {history.length > 0 && (
        <div className="card table-container">
          <h3 className="mb-4">10 Lần Xuất Hiện Gần Nhất Của Số {numberStat.number}</h3>
          <table>
            <thead>
              <tr>
                <th>Mã Kỳ</th>
                <th>Ngày</th>
                <th>Kết Quả (6 số)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={h.Draw_ID}>
                  <td className="text-[var(--accent-primary)]">{h.Draw_ID}</td>
                  <td>{h.Draw_Date}</td>
                  <td>
                    <div className="flex gap-2">
                      {h.Result.split('').map((n, i) => (
                        <span key={i} className={`loto-ball ${n === numberStat.number ? 'hot' : ''}`}>
                          {n}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
