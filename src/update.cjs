const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'admin', 'Desktop', 'Lotobet A-C', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const newDashboard = `const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, handleCopy, historyCheck }) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8 p-6">
        <h2 className="text-center text-xl font-bold text-[var(--accent-primary)] mb-6">BẢNG CHỐT SỐ TỐC ĐỘ CAO (COPY & DÁN)</h2>
        
        <div className="flex flex-col gap-4">
          
          {/* HẠ DÀN 2 SỐ */}
          <div className="card p-4 flex flex-col justify-between relative">
            <div className="absolute top-4 right-4">
              <button onClick={() => handleCopy(dan2, "Hạ Dàn 2 Số")} className="flex items-center gap-1 text-[10px] text-gray-300 border border-gray-500 px-1 py-0.5 rounded bg-[#1a1f35] hover:bg-gray-700">
                <Copy size={10} /> COPY
              </button>
            </div>
            <div className="mb-4">
              <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-red-500">🎯</span> HẠ DÀN 2 SỐ (Bạch Thủ)</div>
              <div className="text-gray-500 text-[10px]">Siêu nổ (1 cặp lộn)</div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {dan2.map(s => (
                <span key={s.number} className="loto-ball" style={{ width: 32, height: 32, fontSize: '0.9rem', margin: 0, borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>
                  {s.number}
                </span>
              ))}
            </div>
            {historyCheck && (
              <div className="text-[10px] flex justify-between items-center text-gray-500">
                <span>Kỳ trước ({historyCheck.drawId}): Đề {historyCheck.resultHau}</span>
                {historyCheck.win2 ? <span className="text-[var(--success)] font-bold">V TRÚNG</span> : <span className="text-[var(--danger)] font-bold">X TRƯỢT</span>}
              </div>
            )}
          </div>

          {/* HẠ DÀN 4 SỐ */}
          <div className="card p-4 flex flex-col justify-between relative">
            <div className="absolute top-4 right-4">
              <button onClick={() => handleCopy(dan4, "Hạ Dàn 4 Số")} className="flex items-center gap-1 text-[10px] text-gray-300 border border-gray-500 px-1 py-0.5 rounded bg-[#1a1f35] hover:bg-gray-700">
                <Copy size={10} /> COPY
              </button>
            </div>
            <div className="mb-4">
              <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-yellow-500">⚡</span> HẠ DÀN 4 SỐ (Tứ Thủ)</div>
              <div className="text-gray-500 text-[10px]">Đột phá (2 cặp lộn)</div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {dan4.map(s => (
                <span key={s.number} className="loto-ball" style={{ width: 32, height: 32, fontSize: '0.9rem', margin: 0, borderColor: '#d1d5db', color: '#d1d5db' }}>
                  {s.number}
                </span>
              ))}
            </div>
            {historyCheck && (
              <div className="text-[10px] flex justify-between items-center text-gray-500">
                <span>Kỳ trước ({historyCheck.drawId}): Đề {historyCheck.resultHau}</span>
                {historyCheck.win4 ? <span className="text-[var(--success)] font-bold">V TRÚNG</span> : <span className="text-[var(--danger)] font-bold">X TRƯỢT</span>}
              </div>
            )}
          </div>

          {/* DÀN 10 SỐ */}
          <div className="card p-4 flex flex-col justify-between relative">
            <div className="absolute top-4 right-4">
              <button onClick={() => handleCopy(dan10, "Dàn 10 Số")} className="flex items-center gap-1 text-[10px] text-gray-300 border border-gray-500 px-1 py-0.5 rounded bg-[#1a1f35] hover:bg-gray-700">
                <Copy size={10} /> COPY
              </button>
            </div>
            <div className="mb-4">
              <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-orange-500">🔥</span> DÀN 10 SỐ 2D</div>
              <div className="text-gray-500 text-[10px]">Cân bằng vốn</div>
            </div>
            <div className="flex flex-wrap gap-1 mb-6">
              {dan10.map(s => (
                <span key={s.number} className="loto-ball hot" style={{ width: 28, height: 28, fontSize: '0.8rem', margin: 0 }}>
                  {s.number}
                </span>
              ))}
            </div>
            {historyCheck && (
              <div className="text-[10px] flex justify-between items-center text-gray-500">
                <span>Kỳ trước ({historyCheck.drawId}): Đề {historyCheck.resultHau}</span>
                {historyCheck.win10 ? <span className="text-[var(--success)] font-bold">V TRÚNG</span> : <span className="text-[var(--danger)] font-bold">X TRƯỢT</span>}
              </div>
            )}
          </div>

          {/* DÀN 20 SỐ */}
          <div className="card p-4 flex flex-col justify-between relative">
            <div className="absolute top-4 right-4">
              <button onClick={() => handleCopy(dan20, "Dàn 20 Số")} className="flex items-center gap-1 text-[10px] text-gray-300 border border-gray-500 px-1 py-0.5 rounded bg-[#1a1f35] hover:bg-gray-700">
                <Copy size={10} /> COPY
              </button>
            </div>
            <div className="mb-4">
              <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-orange-500">🔥</span> DÀN 20 SỐ 2D</div>
              <div className="text-gray-500 text-[10px]">An toàn cao</div>
            </div>
            <div className="flex flex-wrap gap-1 mb-6">
              {dan20.map(s => (
                <span key={s.number} className="loto-ball" style={{ width: 28, height: 28, fontSize: '0.8rem', margin: 0, borderColor: 'var(--success)', color: 'var(--success)' }}>
                  {s.number}
                </span>
              ))}
            </div>
            {historyCheck && (
              <div className="text-[10px] flex justify-between items-center text-gray-500">
                <span>Kỳ trước ({historyCheck.drawId}): Đề {historyCheck.resultHau}</span>
                {historyCheck.win20 ? <span className="text-[var(--success)] font-bold">V TRÚNG</span> : <span className="text-[var(--danger)] font-bold">X TRƯỢT</span>}
              </div>
            )}
          </div>

          {/* 3 SỐ 5 TINH */}
          <div className="card p-4 flex flex-col justify-between">
            <div className="mb-6">
              <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-yellow-500">⭐</span> 3 SỐ 5 TINH (ĐÁNH SỐ ĐƠN)</div>
            </div>
            <div className="flex flex-col items-center gap-6 w-full">
              
              <div className="flex flex-col items-center text-center">
                <div className="text-white font-bold text-xs mb-1">DÀN 3 SỐ</div>
                <div className="text-white font-bold text-sm mb-1">{topSingles.slice(0, 3).map(s => s.number).join(', ')}</div>
                <button onClick={() => handleCopy(topSingles.slice(0,3), "3s5t (3 số)")} className="flex items-center gap-1 text-[10px] text-gray-300 border border-gray-500 px-1 py-0.5 rounded bg-[#1a1f35] hover:bg-gray-700 mt-1">
                  <Copy size={10} /> COPY
                </button>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="text-white font-bold text-xs mb-1">DÀN 4 SỐ</div>
                <div className="text-white font-bold text-sm mb-1">{topSingles.slice(0, 4).map(s => s.number).join(', ')}</div>
                <button onClick={() => handleCopy(topSingles.slice(0,4), "3s5t (4 số)")} className="flex items-center gap-1 text-[10px] text-gray-300 border border-gray-500 px-1 py-0.5 rounded bg-[#1a1f35] hover:bg-gray-700 mt-1">
                  <Copy size={10} /> COPY
                </button>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="text-white font-bold text-xs mb-1">DÀN 5 SỐ</div>
                <div className="text-white font-bold text-sm mb-1">{topSingles.slice(0, 5).map(s => s.number).join(', ')}</div>
                <button onClick={() => handleCopy(topSingles.slice(0,5), "3s5t (5 số)")} className="flex items-center gap-1 text-[10px] text-gray-300 border border-gray-500 px-1 py-0.5 rounded bg-[#1a1f35] hover:bg-gray-700 mt-1">
                  <Copy size={10} /> COPY
                </button>
              </div>

            </div>
            {historyCheck && (
              <div className="text-[10px] flex justify-between items-center text-gray-500 mt-8">
                <span>Kỳ trước ({historyCheck.drawId}): {historyCheck.fullResult}</span>
                {historyCheck.win5Tinh ? <span className="text-[var(--success)] font-bold">V TRÚNG</span> : <span className="text-[var(--danger)] font-bold">X TRƯỢT</span>}
              </div>
            )}
          </div>

          {/* CHẠM CỨNG */}
          <div className="card p-4 flex flex-col justify-between relative">
            <div className="absolute top-4 right-4">
              <button onClick={() => handleCopy(topSingles.slice(0,4), "4 Chạm Cứng")} className="flex items-center gap-1 text-[10px] text-gray-300 border border-gray-500 px-1 py-0.5 rounded bg-[#1a1f35] hover:bg-gray-700">
                <Copy size={10} /> COPY
              </button>
            </div>
            <div className="mb-4">
              <div className="text-white font-bold text-sm flex items-center gap-2"><span className="text-blue-500">💎</span> BẮT CHẠM CỨNG (4 CHẠM)</div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {topSingles.slice(0, 4).map(s => (
                <span key={s.number} className="loto-ball" style={{ width: 32, height: 32, fontSize: '0.9rem', margin: 0, borderColor: 'var(--info)', color: 'var(--info)' }}>
                  {s.number}
                </span>
              ))}
            </div>
            {historyCheck && (
              <div className="text-[10px] flex justify-between items-center text-gray-500">
                <span>Kỳ trước ({historyCheck.drawId}): Đề {historyCheck.resultHau}</span>
                {historyCheck.winCham ? <span className="text-[var(--success)] font-bold">V TRÚNG</span> : <span className="text-[var(--danger)] font-bold">X TRƯỢT</span>}
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* THÔNG TIN HỆ THỐNG */}
      <h1 className="gradient-text mb-6 text-center text-lg">Thông Số Kỹ Thuật</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center p-4">
          <div className="text-gray-500 text-[10px] mb-1">Tổng Số Kỳ</div>
          <div className="text-lg font-bold text-accent-primary">{data.length}</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-gray-500 text-[10px] mb-1">Cập Nhật</div>
          <div className="text-lg font-bold">{new Date().toLocaleDateString('vi-VN')}</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-gray-500 text-[10px] mb-1">Mô Hình</div>
          <div className="text-lg font-bold text-accent-secondary">Ngũ Hành</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-gray-500 text-[10px] mb-1">Độ Tin Cậy</div>
          <div className="text-lg font-bold text-success">Cao</div>
        </div>
      </div>
    </div>
  );
};`;

const startIndex = content.indexOf('const ExecutiveDashboard = ({ data, dan2, dan4, dan10, dan20, topSingles, handleCopy, historyCheck }) => {');
const endIndex = content.indexOf('const PagePlaceholder = ({ title, description }) => (');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newDashboard + '\n\n' + content.substring(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully replaced ExecutiveDashboard');
} else {
  console.log('Could not find the component boundaries');
}
