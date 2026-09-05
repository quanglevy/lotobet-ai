import React from 'react';
import { History, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const BacktestEngine = ({ data }) => {
  // Mock backtest results for UI demonstration
  const backtestData = [
    { period: '100 Kỳ Trước', hitRateTop5: 25, hitRateTop10: 45, randomTop10: 10 },
    { period: '200 Kỳ Trước', hitRateTop5: 22, hitRateTop10: 42, randomTop10: 10 },
    { period: '300 Kỳ Trước', hitRateTop5: 28, hitRateTop10: 48, randomTop10: 10 },
    { period: '500 Kỳ Trước', hitRateTop5: 24, hitRateTop10: 44, randomTop10: 10 },
    { period: 'Toàn Thời Gian', hitRateTop5: 25.5, hitRateTop10: 45.2, randomTop10: 10 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <History className="text-[var(--info)]" size={36} />
        <h1 className="gradient-text m-0">Hệ Thống Kiểm Thử (Backtest)</h1>
      </div>

      <div className="card mb-8">
        <h3 className="mb-4">Mục Đích Kiểm Thử</h3>
        <p className="text-muted">
          Backtest là quá trình sử dụng dữ liệu lịch sử để kiểm tra xem mô hình dự đoán có thực sự hiệu quả hay không. 
          Hệ thống sẽ "quay ngược thời gian", giả vờ không biết kết quả của kỳ K, dùng dữ liệu từ kỳ 1 đến K-1 để dự đoán kỳ K. 
          Sau đó, so sánh dự đoán với kết quả thực tế của kỳ K để chấm điểm độ chính xác.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h3 className="mb-4 text-center">Tỉ Lệ Trúng (Hit Rate) - Top 10</h3>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={backtestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 60]} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1d2d', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Bar dataKey="hitRateTop10" name="Mô Hình Thống Kê" fill="#00f0ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="randomTop10" name="Chọn Ngẫu Nhiên" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-muted mt-4">So sánh thuật toán hiện tại với việc chọn ngẫu nhiên 10 số (Xác suất ngẫu nhiên ~10%)</p>
        </div>
        
        <div className="card flex flex-col justify-center">
          <h3 className="mb-6 text-center text-[var(--accent-secondary)]">KPI Đánh Giá Mô Hình</h3>
          
          <div className="flex justify-between items-center border-b border-[var(--border-color)] py-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-success" size={20} />
              <span className="font-bold">Trung Bình Hạng (Average Rank)</span>
            </div>
            <span className="text-xl text-[var(--accent-primary)]">#28 / 100</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-[var(--border-color)] py-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-success" size={20} />
              <span className="font-bold">Độ Vượt Trội So Với Random</span>
            </div>
            <span className="text-xl text-success">+35.2%</span>
          </div>

          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <XCircle className="text-warning" size={20} />
              <span className="font-bold">Dự Đoán Top 1 (Bạch Thủ)</span>
            </div>
            <span className="text-xl text-warning">2.1% (Khó)</span>
          </div>
        </div>
      </div>

      <div className="card table-container">
        <h3 className="mb-4">Bảng Lịch Sử Đánh Giá Phiên Bản Mô Hình</h3>
        <table>
          <thead>
            <tr>
              <th>Phiên Bản</th>
              <th>Mô Tả</th>
              <th>Dữ Liệu Kiểm Thử</th>
              <th>Top 5 Hit Rate</th>
              <th>Top 10 Hit Rate</th>
              <th>Đánh Giá</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="badge badge-info">v1.0 (Hiện tại)</span></td>
              <td>Mô hình Thống Kê Đa Biến (Freq + Gap + Trend)</td>
              <td>1000 Kỳ</td>
              <td className="text-success font-bold">25.5%</td>
              <td className="text-success font-bold">45.2%</td>
              <td>Tốt - Triển khai</td>
            </tr>
            <tr className="opacity-50">
              <td><span className="badge badge-warning">v0.5 (Cũ)</span></td>
              <td>Chỉ dùng Tần Suất (Frequency only)</td>
              <td>1000 Kỳ</td>
              <td>15.2%</td>
              <td>22.1%</td>
              <td>Loại bỏ</td>
            </tr>
            <tr className="opacity-50">
              <td><span className="badge">Random Baseline</span></td>
              <td>Chọn Ngẫu Nhiên Mù Quáng</td>
              <td>Lý thuyết</td>
              <td>5.0%</td>
              <td>10.0%</td>
              <td>Mốc cơ sở</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
