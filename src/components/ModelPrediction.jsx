import React from 'react';
import { Brain, Zap, Target, AlertTriangle } from 'lucide-react';

export const ModelPrediction = ({ topTien, topHau }) => {
  const renderPredictionTable = (title, topScores) => (
    <div className="card table-container flex-1">
      <h3 className="mb-4 text-center text-[var(--accent-primary)]">{title}</h3>
      <p className="text-center text-muted mb-4 text-sm">Gợi ý Dàn Đề 10 Số (Top 10)</p>
      <table>
        <thead>
          <tr>
            <th>Hạng</th>
            <th>Bộ Số</th>
            <th>Điểm Cầu</th>
            <th>Lý Do Soi Cầu (Bóng/Markov)</th>
          </tr>
        </thead>
        <tbody>
          {topScores.slice(0, 10).map((stat, idx) => {
            const confidence = idx < 3 ? 'High' : (idx < 7 ? 'Medium' : 'Low');
            return (
              <tr key={stat.number}>
                <td>
                  <span className={`badge ${idx < 3 ? 'badge-danger' : 'badge-info'}`}>
                    Top {idx + 1}
                  </span>
                </td>
                <td>
                  <span className="loto-ball hot" style={{ width: 40, height: 40, fontSize: '1.2rem' }}>
                    {stat.number}
                  </span>
                </td>
                <td>
                  <div className="text-xl font-bold text-white">{stat.score}</div>
                </td>
                <td>
                  <span className={confidence === 'High' ? 'text-success font-bold' : (confidence === 'Medium' ? 'text-warning' : 'text-muted')}>
                    {stat.reason}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Brain className="text-[var(--accent-secondary)]" size={36} />
        <h1 className="gradient-text m-0">AI Soi Cầu Bóng / Markov (Kỳ Tới)</h1>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="card border-t-4 border-t-[var(--success)]">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-[var(--success)]" />
            <h3 className="m-0">Thuật Toán Bắt Cầu</h3>
          </div>
          <p className="text-muted mt-2 text-sm">Phân tích Bóng Dương / Bóng Âm của kỳ trước. Kết hợp chuỗi Markov để tìm ra con số nào thường đi theo sau con số vừa xổ.</p>
        </div>
        <div className="card border-t-4 border-t-[var(--accent-primary)]">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-[var(--accent-primary)]" />
            <h3 className="m-0">Phương Pháp Vào Tiền</h3>
          </div>
          <p className="text-xl font-bold text-white">Đánh Dàn 10 Số</p>
          <p className="text-muted mt-2 text-sm">Tỉ lệ ăn Lotobet là 1:99. Đánh bao 10 số (Dàn đề 10) giúp tăng tỉ lệ thắng lên cực cao mà vẫn đảm bảo lợi nhuận x8.9 lần.</p>
        </div>
        <div className="card border-t-4 border-t-[var(--warning)]">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-[var(--warning)]" />
            <h3 className="m-0">Lưu Ý Về Data (Rất Quan Trọng)</h3>
          </div>
          <p className="text-white text-sm">
            Thuật toán <span className="text-[var(--warning)] font-bold">Chuỗi Markov</span> cần rất nhiều lịch sử để học. Bạn càng chịu khó gõ tay nhiều kỳ, AI đoán càng chính xác!
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        {renderPredictionTable('🔥 DÀN 10 TIỀN NHỊ (Đầu)', topTien)}
        {renderPredictionTable('🔥 DÀN 10 HẬU NHỊ (Đuôi)', topHau)}
      </div>
    </div>
  );
};
